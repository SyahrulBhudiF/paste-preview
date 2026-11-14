import type { ReactNode } from "react";
import { statusPage } from "./-status-page.styles";

const styles = statusPage();

export function StatusPage({
	eyebrow,
	title,
	description,
	children,
}: {
	eyebrow: string;
	title: string;
	description: string;
	children: ReactNode;
}) {
	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<section className={styles.section}>
					<div className={styles.content}>
						<p className={styles.eyebrow}>{eyebrow}</p>
						<h1 className={styles.title}>{title}</h1>
						<p className={styles.description}>{description}</p>
						<div className={styles.actions}>{children}</div>
					</div>
				</section>
			</div>
		</main>
	);
}
