import { meili } from "./meili";
async function run() {

 await meili.index("mangas")
  .updateSettings({

   rankingRules:[
    "words",
    "typo",
    "proximity",
    "attribute",
    "sort",
    "exactness",
    "views:desc",
    "rating:desc"
   ]

 });

 console.log("Meili configured");

}

run();