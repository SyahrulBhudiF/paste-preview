interface FieldErrorsProps {
	errors: ReadonlyArray<{ message: string } | undefined>;
}

export function FieldErrors({ errors }: FieldErrorsProps) {
	const message = errors.find((error) => Boolean(error))?.message;

	if (!message) return null;

	return (
		<p role="alert" className="mt-1 text-xs text-destructive">
			{message}
		</p>
	);
}
