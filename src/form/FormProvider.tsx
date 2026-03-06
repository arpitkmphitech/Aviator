import { cn } from "@/lib/utils";
import React from "react";
import { FormProvider as Form } from "react-hook-form";
import { IFormProvider } from "@/types/form";

const FormProvider: React.FC<IFormProvider> = ({
  children,
  onSubmit,
  methods,
  className,
}) => {
  return (
    <Form {...methods}>
      <form noValidate className={cn(className)} onSubmit={onSubmit}>
        {children}
      </form>
    </Form>
  );
};

export default FormProvider;
