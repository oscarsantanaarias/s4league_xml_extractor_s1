const fs = require("fs");

// Files
const INPUT_FILE = "iteminfo.x7";
const OUTPUT_FILE = "items.sql";

// Helpers for IDs
const padSub = (id) => id.toString().padStart(2, "0");
const padItem = (num) => num.toString().padStart(4, "0");

async function main() {
  const xml = fs.readFileSync(INPUT_FILE, "utf8");

  const categoryRegex = /<category\s+id="(\d+)"[^>]*>([\s\S]*?)<\/category>/g;
  const subCategoryRegex = /<sub_category\s+id="(\d+)"[^>]*>([\s\S]*?)<\/sub_category>/g;
  const itemRegex = /<item\s+number="(\d+)"\s+NAME="([^"]+)"[^>]*>/g;

  let itemsInsert = [];
  let infosInsert = [];

  let categoryMatch;
  while ((categoryMatch = categoryRegex.exec(xml)) !== null) {
    const categoryId = categoryMatch[1];
    const categoryContent = categoryMatch[2];

    let subCategoryMatch;
    while ((subCategoryMatch = subCategoryRegex.exec(categoryContent)) !== null) {
      const subId = padSub(subCategoryMatch[1]);
      const subContent = subCategoryMatch[2];

      let itemMatch;
      while ((itemMatch = itemRegex.exec(subContent)) !== null) {
        const itemNum = padItem(itemMatch[1]);
        const itemName = itemMatch[2];
        const finalId = parseInt(`${categoryId}${subId}${itemNum}`);

        // shop_items
        itemsInsert.push(
          `(${finalId}, 1, 0, 1, 0, 0, 0, 0, 0, 1)`
        );

        // shop_iteminfos
        infosInsert.push(
          `(${finalId}, 2, 1, 0, 1)`
        );
      }
    }
  }

  let sqlOutput = "";

  if (itemsInsert.length > 0) {
    sqlOutput +=
      "-- Dumping data for table s4_s1.shop_items\n" +
      "INSERT INTO `shop_items` (`Id`, `RequiredGender`, `RequiredLicense`, `Colors`, `UniqueColors`, `RequiredLevel`, `LevelLimit`, `RequiredMasterLevel`, `IsOneTimeUse`, `IsDestroyable`) VALUES\n" +
      itemsInsert.join(",\n") +
      ";\n\n";
  }

  if (infosInsert.length > 0) {
    sqlOutput +=
      "-- Dumping data for table s4_s1.shop_iteminfos\n" +
      "INSERT INTO `shop_iteminfos` (`ShopItemId`, `PriceGroupId`, `EffectGroupId`, `DiscountPercentage`, `IsEnabled`) VALUES\n" +
      infosInsert.join(",\n") +
      ";\n";
  }

  fs.writeFileSync(OUTPUT_FILE, sqlOutput, "utf8");
  console.log(`✅ items.sql generated with ${itemsInsert.length} items`);
}

main().catch((err) => console.error("Error:", err));
