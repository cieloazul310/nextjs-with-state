import { Viewer } from "@/components/viewer";
import { IncrementButton } from "@/components/increment-button";

export default function Page() {
  return (
    <div>
      <p>about</p>
      <Viewer />
      <IncrementButton>Increment</IncrementButton>
    </div>
  );
}
