import { css } from "@styled/css";
import { PasteForm } from "./components/form";
import { featureMainStyles } from "./styles";

export function PastePreviewFeature() {
	return (
		<main className={css(featureMainStyles)}>
			<PasteForm />
		</main>
	);
}
