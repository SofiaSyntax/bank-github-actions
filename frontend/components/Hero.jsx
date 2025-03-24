import Link from "next/link";

export default function Hero() {
  return (
    <div
      className=" relative w-full min-h-[400px] md:min-h-[600px] "
      style={{
        backgroundImage: "url(assets/bankpic.png)",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md mt-64">
          <h1 className="mb-5 text-5xl font-bold">Welcome to BestBank</h1>
          <p className="mb-5">
          We’re here to make managing your money simple and secure. Whether you’re saving for the future or handling everyday expenses, BestBank has got you covered. Open an account in just a few minutes and start your journey with us!
          </p>
          <Link href="/register">
            <button className="btn btn-primary">Create Account Now</button>
          </Link>
        </div>
      </div>
      
    </div>
  )
}
