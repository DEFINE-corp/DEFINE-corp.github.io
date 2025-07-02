// pages/index.js
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    window.location.href = '/index.html'; // public/index.html 로 리디렉션
  }, []);

  return null;
}