Here I share a script that extracts all items that are not implemented in the database into a items.sql with a query to just implementent,
if the item is already in the db it won't extract it just items that are not added in db, but that are in the itemInfo.xml/x7 from Season 1.
All you need is Node.js installed and run the script.

To Extract items from ItemInfo.x7 that are not included in the database use extractor.js > node extractor.js
To Extract all items from the ItemInfo.x7 to build a from scratch shop_iteminfos + shop_items use extractor_all, but remember to empty those two, > node extractor_all.js


