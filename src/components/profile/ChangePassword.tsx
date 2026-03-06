"use client";

import md5 from "md5";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "@/form/FormProvider";
import PasswordField from "@/form/PasswordField";
import { ChangePasswordSchema } from "@/lib/schema";
import Button from "@/components/common/Button";
import { IChangePassword } from "@/types/auth";
import { useTranslation } from "react-i18next";
import useChangePassword from "@/hooks/profile/useChangePassword";

const ChangePassword = () => {
  const { t } = useTranslation("profile");
  const { changePassword, isPending } = useChangePassword();
  const methods = useForm<IChangePassword>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onTouched",
    resolver: yupResolver(
      ChangePasswordSchema
    ) as unknown as Resolver<IChangePassword>,
  });

  const { reset } = methods;

  const onSubmit = async (data: IChangePassword) => {
    await changePassword({
      oldPassword: md5(data.oldPassword),
      newPassword: md5(data.newPassword),
    });
    reset();
  };

  return (
    <div className="w-full">
      <FormProvider
        methods={methods}
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full"
      >
        <div className="rounded-[12px] border border-[#ECECED] bg-white p-6">
          <div className="flex flex-col gap-6">
            <PasswordField
              name="oldPassword"
              placeholder={t("enterCurrentPassword")}
            />
            <PasswordField
              name="newPassword"
              placeholder={t("enterNewPassword")}
            />
            <PasswordField
              name="confirmPassword"
              placeholder={t("confirmNewPassword")}
            />
          </div>
        </div>
        <div className="mt-[49px] flex justify-center">
          <Button
            type="submit"
            className="w-[300px]"
            disabled={isPending}
            loader={isPending}
          >
            {t("update")}
          </Button>
        </div>
      </FormProvider>
    </div>
  );
};

export default ChangePassword;
