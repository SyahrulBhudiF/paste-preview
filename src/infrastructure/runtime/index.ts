import { Effect, ManagedRuntime } from "effect";
import { AllServicesLive } from "@/infrastructure/services";

const AppRuntime = ManagedRuntime.make(AllServicesLive);

export const runEffect = <A, E, R>(effect: Effect.Effect<A, E, R>): Promise<A> =>
  AppRuntime.runPromise(effect as Effect.Effect<A, E, never>);
