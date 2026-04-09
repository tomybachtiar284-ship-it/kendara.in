
// Google Identity Services - Client Side Auth
// Client Secret is NOT stored here (only needed for server-side flows)
export const GOOGLE_CLIENT_ID = '335108619607-g5772ml73i31j62s23uja0nnespp6sbv.apps.googleusercontent.com';

export interface GoogleUser {
  name: string;
  email: string;
  picture: string;
  sub: string; // unique Google ID
}

// Parse the JWT credential from Google Sign-In response
export function parseGoogleCredential(credential: string): GoogleUser | null {
  try {
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      sub: payload.sub,
    };
  } catch {
    return null;
  }
}

// Initialize Google Sign-In and set up global callback
export function initGoogleSignIn(callback: (user: GoogleUser) => void): void {
  const tryInit = () => {
    const google = (window as any).google;
    if (!google?.accounts?.id) {
      setTimeout(tryInit, 300);
      return;
    }
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: { credential: string }) => {
        const user = parseGoogleCredential(response.credential);
        if (user) callback(user);
      },
      auto_select: true, // auto sign-in if browser has active Google session
      cancel_on_tap_outside: false,
    });
    // Show "One Tap" popup automatically
    google.accounts.id.prompt();
  };
  tryInit();
}

// Sign out
export function googleSignOut(callback?: () => void): void {
  const google = (window as any).google;
  if (google?.accounts?.id) {
    google.accounts.id.disableAutoSelect();
  }
  callback?.();
}
