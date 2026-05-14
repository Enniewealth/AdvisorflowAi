import Button from "./Button";


export default function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-red-800">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6">{message}</p>
      {onRetry && (
        <Button className="mt-4" type="button" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
