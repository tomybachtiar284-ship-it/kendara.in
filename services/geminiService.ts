
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMotorDescription = async (brand: string, model: string, year: number, condition: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Buatkan deskripsi promosi singkat dan menarik (maksimal 3 kalimat) untuk motor bekas ${brand} ${model} tahun ${year} dengan kondisi ${condition}. Fokuskan pada keunggulan motor ini untuk calon pembeli di Palu.`,
    });
    return response.text || "Motor berkualitas dengan harga bersaing. Siap pakai untuk mobilitas harian Anda.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Motor berkualitas tinggi dengan kondisi terawat. Hubungi admin untuk detail lebih lanjut.";
  }
};
