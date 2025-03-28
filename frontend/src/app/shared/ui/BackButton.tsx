"use client";
// import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ label = 'Back' }) => {
  const router = useRouter();

  // if (href) {
  //   return (
  //     <Link href={href} className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 border-4 border-blue-500 bg-white text-blue-900 font-extrabold rounded-2xl shadow-lg hover:bg-red-600 hover:text-white transition">
  //       <ArrowLeft size={20} />
  //       {label}
  //     </Link>
  //   );
  // }

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 border-4 border-blue-500 bg-white text-blue-900 font-extrabold rounded-2xl shadow-lg hover:bg-red-600 hover:text-white transition"
    >
      <ArrowLeft size={20} />
      {label}
    </button>
  );
};

export default BackButton;