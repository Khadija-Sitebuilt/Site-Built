type DemoPageProps = {
  searchParams?: Promise<{ embed?: string }>;
};

export default async function DemoPage({ searchParams }: DemoPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const isEmbed = resolvedParams?.embed === "1";

  return (
    <div className={isEmbed ? "bg-black" : "min-h-screen bg-gray-50 px-6 py-12"}>
      <div className={isEmbed ? "w-full" : "mx-auto w-full max-w-5xl"}>
        <div
          className={
            isEmbed
              ? "w-full"
              : "bg-white border border-gray-100 rounded-2xl shadow-lg p-6 sm:p-8"
          }
        >
          {!isEmbed && (
            <>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                SiteBuilt Demo
              </h1>
              <p className="text-gray-600 mb-6">
                Watch the walkthrough video below.
              </p>
            </>
          )}
          <div
            className={
              isEmbed
                ? "relative w-full bg-black"
                : "relative w-full overflow-hidden rounded-xl border border-gray-200 bg-black"
            }
          >
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src="https://drive.google.com/file/d/1yJr4aGimZySwkNXnVAE-hrRhrCmz6TOB/preview"
                title="SiteBuilt Demo Video"
                allow="autoplay; fullscreen; picture-in-picture"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
