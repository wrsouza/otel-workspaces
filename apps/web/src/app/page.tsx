import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <br />
      <h1>OpenTelemetry Test App</h1>
      <div style={{ marginTop: "20px" }}>
        <Link href="/payments" className="btn btn-primary">
          Testing Payments
        </Link>
      </div>
    </main>
  );
}
