"use client";

//import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { AuthInput } from "../forms/auth-input";

export default function EmailVerification() {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center pb-6">
        <h2 className="text-lg font-medium text-gray">Reset your password</h2>
        <p className="text-xs font-light text-gray mb-6">
          Enter your Email below to receive an OTP or a password reset link.
        </p>
        <CardContent className="space-y-8 px-8 pb-8">
          <form className="space-y-4">
            <AuthInput
              id="email"
              type="email"
              label="Email"
              placeholder="Email"
              className="mb-6"
            />
            <Button
              type="submit"
              className="w-full auth-button auth-button-primary"
            >
              Reset Password
            </Button>
          </form>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
