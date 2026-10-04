"use client";

import { useState } from "react";

import { ArrowSwap } from "@/components/ui/arrow-swap";
import { cn } from "@/lib/cn";
import { CONTACT } from "@/lib/content";

type Field = "email" | "firstName" | "lastName" | "phone" | "company" | "message";
type Values = Record<Field, string>;

const EMPTY: Values = { email: "", firstName: "", lastName: "", phone: "", company: "", message: "" };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Values) {
  const errors: Partial<Record<Field, string>> = {};
  if (!EMAIL.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (!values.firstName.trim()) errors.firstName = "Enter your first name.";
  if (values.phone.trim() && !/^[+\d][\d\s()-]{6,}$/.test(values.phone.trim()))
    errors.phone = "Enter a valid phone number.";
  if (values.message.trim().length < 10) errors.message = "Tell us a little about your project.";
  return errors;
}

function FieldLabel({ field, children, optional }: { field: Field; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={`contact-${field}`} className="type-eyebrow mb-3 block text-stone">
      {children}
      {optional ? <span className="ml-2 normal-case tracking-normal text-mist">(optional)</span> : null}
    </label>
  );
}

function FieldError({ field, message }: { field: Field; message?: string }) {
  return message ? (
    <p id={`contact-${field}-error`} className="mt-2 font-sans text-sm text-red-600">
      {message}
    </p>
  ) : null;
}

/**
 * The enquiry form. There is no mail server behind the site yet, so sending
 * opens the visitor's own email app with the message composed and addressed
 * to VICIAD; the form is checked first, and the visitor is told what happens.
 */
export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);

  const update = (field: Field) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const name = `${values.firstName.trim()} ${values.lastName.trim()}`.trim();
    const lines = [
      values.message.trim(),
      "",
      "—",
      `Name: ${name}`,
      `Email: ${values.email.trim()}`,
      values.phone.trim() && `Phone: ${values.phone.trim()}`,
      values.company.trim() && `Company: ${values.company.trim()}`,
    ].filter((line) => line !== "");
    const subject = `Project enquiry from ${name}${values.company.trim() ? `, ${values.company.trim()}` : ""}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      lines.join("\n"),
    )}`;
    setSent(true);
  };

  const input = (field: Field, invalid: boolean) =>
    cn(
      "peer w-full border-b bg-transparent pb-3 pt-1 font-sans text-[17px] text-onyx outline-none transition-colors duration-300 placeholder:text-mist focus:border-brand",
      invalid ? "border-red-600" : "border-ash hover:border-stone",
    );

  const describe = (field: Field) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    onChange: update(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
  });

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FieldLabel field="email">Email address</FieldLabel>
        <input type="email" autoComplete="email" {...describe("email")} className={input("email", !!errors.email)} />
        <FieldError field="email" message={errors.email} />
      </div>
      <div>
        <FieldLabel field="firstName">First name</FieldLabel>
        <input autoComplete="given-name" {...describe("firstName")} className={input("firstName", !!errors.firstName)} />
        <FieldError field="firstName" message={errors.firstName} />
      </div>
      <div>
        <FieldLabel field="lastName" optional>
          Last name
        </FieldLabel>
        <input autoComplete="family-name" {...describe("lastName")} className={input("lastName", false)} />
      </div>
      <div>
        <FieldLabel field="phone" optional>
          Phone number
        </FieldLabel>
        <input type="tel" autoComplete="tel" {...describe("phone")} className={input("phone", !!errors.phone)} />
        <FieldError field="phone" message={errors.phone} />
      </div>
      <div>
        <FieldLabel field="company" optional>
          Company
        </FieldLabel>
        <input autoComplete="organization" {...describe("company")} className={input("company", false)} />
      </div>
      <div className="sm:col-span-2">
        <FieldLabel field="message">How may we help?</FieldLabel>
        <textarea rows={5} {...describe("message")} className={cn(input("message", !!errors.message), "resize-y")} />
        <FieldError field="message" message={errors.message} />
      </div>

      <div className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="group inline-flex h-12 items-center gap-3 self-start rounded-full bg-brand pl-6 pr-1.5 font-sans text-[15px] font-medium text-white outline-none transition-colors duration-300 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          Send message
          <span className="flex size-9 items-center justify-center rounded-full bg-white text-brand">
            <ArrowSwap />
          </span>
        </button>
        <p role="status" aria-live="polite" className="max-w-sm font-sans text-sm text-stone">
          {sent ? (
            <>
              Your email app should now be open with your message ready to send. If it isn&rsquo;t, write to us
              at{" "}
              <a href={`mailto:${CONTACT.email}`} className="text-brand underline underline-offset-4">
                {CONTACT.email}
              </a>
              .
            </>
          ) : (
            "Sending opens your email app with the message ready to go."
          )}
        </p>
      </div>
    </form>
  );
}
