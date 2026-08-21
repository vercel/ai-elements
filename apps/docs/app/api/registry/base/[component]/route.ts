import { createRegistryGET, createRegistryHandler } from "../../_lib/create-registry";

const registryPromise = createRegistryHandler({
  elementsPackage: "elements-base",
  uiPackageName: "@repo/base-ui",
  registryStyle: "base",
  uiImportPrefix: "@/registry/base/ui/",
  utilsImportPrefix: "@/lib/",
  apiBasePath: "/api/registry/base",
  examplesPackage: "examples-base",
});

export const GET = createRegistryGET(registryPromise);
