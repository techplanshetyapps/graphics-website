const ecosystems = [
  {
    slug: "jungle-forest",
    title: "Jungle Forest",
    type: "3d",
    modelPath: "/models/jungle-forest.glb",
    description:
      "Tropical rainforests form dense, multi-layered canopies that host an extraordinary concentration of plant and animal species, often described as the most biodiverse terrestrial ecosystems on Earth.",
    fact: "Rainforests cover roughly 6% of Earth's land surface but are thought to contain more than half of the world's plant and animal species.",
    background: { top: "#0b3d16", bottom: "#1c5c2a" },
    cameraDistance: 9,
  },
  {
    slug: "ocean-floor",
    title: "Ocean Floor",
    type: "3d",
    modelPath: "/models/ocean-floor.glb",
    description:
      "The seabed spans sunlit shallows to the pitch-black abyssal plain, supporting communities ranging from coral reefs to chemosynthetic life clustered around hydrothermal vents.",
    fact: "Less than a quarter of the world's ocean floor has been mapped in high resolution, making it less explored than the surface of the Moon or Mars.",
    background: { top: "#012a4a", bottom: "#01497c" },
    cameraDistance: 9,
  },
  {
    slug: "cloud-forest",
    title: "Cloud Forest",
    type: "3d",
    modelPath: "/models/cloud-forest.glb",
    description:
      "High-elevation tropical forests sit within near-constant low-level cloud cover, creating cool, moisture-saturated conditions where mosses, ferns, and orchids thrive on nearly every surface.",
    fact: "Cloud forests capture additional moisture directly from fog through a process called 'horizontal precipitation,' supplementing rainfall.",
    background: { top: "#3a4a4f", bottom: "#7c9a92" },
    cameraDistance: 9,
  },
  {
    slug: "seagrass-meadow",
    title: "Seagrass Meadow",
    type: "3d",
    modelPath: "/models/seagrass-meadow.glb",
    description:
      "Seagrasses are the only flowering plants that live fully submerged in seawater, forming dense underwater meadows that stabilize sediment and serve as nurseries for countless marine species.",
    fact: "Seagrass meadows can sequester carbon up to 35 times faster than tropical rainforests per unit area, making them a major 'blue carbon' habitat.",
    background: { top: "#023047", bottom: "#219ebc" },
    cameraDistance: 10,
  },
  {
    slug: "tropical-savanna",
    title: "Tropical Savanna",
    type: "3d",
    modelPath: "/models/tropical-savanna.glb",
    description:
      "Savannas are grassland ecosystems scattered with drought-resistant trees, shaped by a strong wet-and-dry seasonal cycle and regular fire, and home to some of the largest land-migrating herds on Earth.",
    fact: "The African savanna supports some of the largest remaining populations of megafauna, including elephants, giraffes, and large predator guilds.",
    background: { top: "#8d6a3f", bottom: "#e0c068" },
    cameraDistance: 10,
  },
  {
    slug: "desert-fauna",
    title: "Desert Fauna",
    type: "3d",
    modelPath: "/models/desert-fauna.glb",
    description:
      "Desert-adapted animals survive extreme temperature swings and scarce water through specialized behaviors and physiology, from nocturnal activity to highly efficient kidneys that minimize water loss.",
    fact: "Many desert reptiles and small mammals never need to drink free-standing water at all, obtaining sufficient moisture from the food they eat.",
    background: { top: "#7a4a1f", bottom: "#e9c46a" },
    cameraDistance: 9,
  },
  {
    slug: "epiphytic-canopy",
    title: "Epiphytic Canopy Ecosystem",
    type: "2d",
    modelPath: "/models/epiphytic-canopy.glb",
    description:
      "Epiphytes are plants that grow harmlessly on the surface of other plants, especially tree trunks and branches, gathering moisture and nutrients from the air and rain rather than from soil.",
    fact: "A single large rainforest tree can host dozens of epiphyte species, including orchids, bromeliads, and ferns, each occupying a distinct microhabitat along the trunk.",
    background: { top: "#123524", bottom: "#2e6b46" },
    cameraDistance: 6,
  },
  {
    slug: "icebergs-drift",
    title: "Large Icebergs Drift",
    type: "2d",
    modelPath: "/models/icebergs-drift.glb",
    description:
      "Icebergs calve from glaciers and ice shelves and drift on ocean currents for years, with roughly seven-eighths of their mass hidden beneath the waterline.",
    fact: "The phrase 'tip of the iceberg' reflects a real physical ratio: only about 10% of an iceberg's volume is typically visible above the surface.",
    background: { top: "#0a1e3f", bottom: "#3a6ea5" },
    cameraDistance: 6,
  },
];

module.exports = { ecosystems };
