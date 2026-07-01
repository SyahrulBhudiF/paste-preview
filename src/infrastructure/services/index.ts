import { Layer } from "effect";
import { PasteStorageService } from "./paste-storage";

export const AllServicesLive = Layer.mergeAll(PasteStorageService.layer);

export { PasteStorageService };
