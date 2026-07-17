import { createRegistryGET, createRegistryHandler } from "../_lib/create-registry";

const registryPromise = createRegistryHandler({
  elementsPackage: "elements",
  uiPackageName: "@repo/shadcn-ui",
  registryStyle: "default",
  uiImportPrefix: "@/registry/default/ui/",
  utilsImportPrefix: "@/lib/",
  apiBasePath: "/api/registry",
  examplesPackage: "examples",
});

export const GET = createRegistryGET(registryPromise);
