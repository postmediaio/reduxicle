import { generateNamesFromPattern } from "../../createHOC";

describe("generateNamesFromPattern", () => {
  it("should generate propper names from patterns", () => {
    const pattern = {
      dialogName: {
        default: "dialog",
        pattern: "{name}Dialog",
      },
      isDialogOpen: {
        default: "isDialogOpen",
        pattern: "is{name}DialogOpen",
      },
      openDialog: {
        default: "openDialog",
        pattern: "open{name}Dialog",
      },
      closeDialog: {
        default: "closeDialog",
        pattern: "close{name}Dialog"
      },
    };

    const names = generateNamesFromPattern(pattern, { name: "products" });
    expect(names).toEqual({
      dialogName: "productsDialog",
      isDialogOpen: "isProductsDialogOpen",
      openDialog: "openProductsDialog",
      closeDialog: "closeProductsDialog",
    });
  })
});