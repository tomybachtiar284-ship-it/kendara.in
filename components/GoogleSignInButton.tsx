
import React, { useEffect, useRef } from 'react';
import { GOOGLE_CLIENT_ID, GoogleUser, parseGoogleCredential } from '../services/googleAuth';

interface GoogleSignInButtonProps {
  onSignIn: (user: GoogleUser) => void;
  className?: string;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onSignIn, className = '' }) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tryRender = () => {
      const google = (window as any).google;
      if (!google?.accounts?.id || !buttonRef.current) {
        setTimeout(tryRender, 300);
        return;
      }
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: { credential: string }) => {
          const user = parseGoogleCredential(response.credential);
          if (user) onSignIn(user);
        },
        auto_select: true,
      });
      google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        shape: 'pill',
        theme: 'outline',
        text: 'signin_with',
        size: 'large',
        logo_alignment: 'left',
        width: '280',
      });
      // Also trigger One Tap popup
      google.accounts.id.prompt();
    };
    tryRender();
  }, [onSignIn]);

  return (
    <div className={`flex justify-center ${className}`}>
      <div ref={buttonRef} />
    </div>
  );
};

export default GoogleSignInButton;
