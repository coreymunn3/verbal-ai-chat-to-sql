import DarkModeToggle from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEventHandler, ChangeEventHandler } from "react";

export const HeaderInput = ({
  handleSubmit,
  handleInputChange,
  input,
}: {
  handleSubmit: FormEventHandler<HTMLFormElement>;
  handleInputChange: ChangeEventHandler<HTMLInputElement>;
  input: string;
}) => {
  return (
    <div>
      <div className="flex justify-between align-middle mb-10">
        <div className="font-bold text-3xl">Natural Language to PostgreSQL</div>
        <DarkModeToggle />
      </div>

      <div>
        <form className="flex space-x-2" onSubmit={handleSubmit}>
          <Input value={input} onChange={handleInputChange} />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
};
