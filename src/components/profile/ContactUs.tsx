"use client";

import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "@/form/FormProvider";
import { ContactUsSchema } from "@/lib/schema";
import Button from "@/components/common/Button";
import { IContactUs } from "@/types/auth";
import TextInput from "@/form/TextInput";
import { useTranslation } from "react-i18next";
import useContactUs from "@/hooks/profile/useContactUs";

const ContactUs = () => {
  const { t } = useTranslation("profile");
  const { contactUs, isPending } = useContactUs();
  const methods = useForm<IContactUs>({
    mode: "onTouched",
    defaultValues: { name: "", email: "", subject: "", message: "" },
    resolver: yupResolver(ContactUsSchema) as unknown as Resolver<IContactUs>,
  });

  const { reset } = methods;

  const onSubmit = async (data: IContactUs) => {
    await contactUs(data);
    reset();
  };

  return (
    <div className="w-full">
      <FormProvider
        methods={methods}
        className="w-full"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className="rounded-[12px] border border-[#ECECED] bg-white p-6">
          <div className="flex flex-col gap-6">
            <TextInput name="name" placeholder={t("enterName")} />
            <TextInput name="email" placeholder={t("enterEmail")} />
            <TextInput name="subject" placeholder={t("enterSubject")} />
            <TextInput
              textarea
              name="message"
              className="resize-none"
              placeholder={t("enterMessage")}
            />
          </div>
        </div>
        <div className="mt-[49px] flex justify-center">
          <Button
            type="submit"
            className="w-[612px]"
            disabled={isPending}
            loader={isPending}
          >
            {t("submit")}
          </Button>
        </div>
      </FormProvider>
    </div>
  );
};

export default ContactUs;
