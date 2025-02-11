import { Suspense } from "react";
import CreateApartmentPage from "../CreateApartmentPage";

export default function CreatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateApartmentPage />
    </Suspense>
  );
}
