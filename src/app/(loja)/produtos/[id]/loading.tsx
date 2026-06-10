import { Container } from "@/components/ui/container";

/** Skeleton da página de produto: galeria + coluna de compra. */
export default function LoadingProduto() {
  return (
    <Container className="py-8 sm:py-12">
      <div className="mb-6 h-5 w-36 animate-pulse rounded-md bg-surface/60" />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="aspect-square animate-pulse rounded-3xl bg-surface/60" />
        <div className="flex flex-col gap-4">
          <div className="h-6 w-24 animate-pulse rounded-full bg-surface/60" />
          <div className="h-10 w-3/4 animate-pulse rounded-xl bg-surface/60" />
          <div className="h-12 w-48 animate-pulse rounded-xl bg-surface/60" />
          <div className="h-5 w-56 animate-pulse rounded-md bg-surface/60" />
          <div className="mt-4 h-28 animate-pulse rounded-2xl bg-surface/60" />
          <div className="h-13 animate-pulse rounded-xl bg-surface/60" />
          <div className="h-13 animate-pulse rounded-xl bg-surface/60" />
        </div>
      </div>
    </Container>
  );
}
