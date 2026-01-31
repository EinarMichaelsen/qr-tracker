import { QrForm } from "@/components/qr-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-xl space-y-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          QR Code Tracker
        </h1>
        <p className="text-muted-foreground">
          Enter a URL to generate a trackable QR code with analytics.
        </p>
      </div>
      <div className="mt-8 w-full max-w-xl">
        <QrForm />
      </div>
    </main>
  );
}
