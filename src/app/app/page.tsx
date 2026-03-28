import { Navbar } from "@/components/navbar";
import { SearchExperience } from "@/components/search-experience";

export default function AppPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <SearchExperience />
      </div>
    </>
  );
}
