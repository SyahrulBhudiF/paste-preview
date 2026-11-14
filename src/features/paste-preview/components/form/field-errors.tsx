import { css } from "@styled/css";
import { fieldErrorStyles } from "@/features/paste-preview/styles/field-errors";

interface FieldErrorsProps {
	errors: ReadonlyArray<{ message: string } | undefined>;
}

export function FieldErrors({ errors }: FieldErrorsProps) {
	const message = errors.find((error) => Boolean(error))?.message;

	if (!message) return null;

	return (
		<p role="alert" className={css(fieldErrorStyles)}>
			{message}
		</p>
	);
}
