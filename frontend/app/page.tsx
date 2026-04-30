import ShortenerForm from "@/components/ShortenerForm";
import Banner from "@/components/Banner";

export default function Home() {
  return (
    <>
      <Banner />

      <main className="mx-auto max-w-7xl mt-44 mb-20">
        <div>
          <div className="text-center pb-4">
            <h1 className="text-[1.5rem] font-bold">Raccourcisseur d'URL</h1>
          </div>
          <ShortenerForm />
        </div>
      </main>
    </>
  );
}