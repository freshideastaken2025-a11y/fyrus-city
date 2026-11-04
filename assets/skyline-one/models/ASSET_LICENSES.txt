# Third-party 3D assets used in SKYLINE ONE

All files were downloaded on 2026-11-04 from the Khronos Group glTF Sample Assets repository
(https://github.com/KhronosGroup/glTF-Sample-Assets, `Models/<name>/glTF-Binary/<name>.glb`).
Each model's own `LICENSE.md` / `metadata.json` in that repository was read before use.
Optimisation applied here: embedded punctual lights removed, textures resized to ≤1024 px and re-encoded as WebP,
geometry deduplicated/welded. chair-sheen.glb and plant.glb were additionally decimated with meshoptimizer
(40k → 12k and 68k → 17k triangles) for real-time use; no other geometry changes. No purchase or subscription was involved.

| File here | Source model | Licence | Credit (as stated in source metadata) | Commercial use |
|---|---|---|---|---|
| sofa-velvet.glb | GlamVelvetSofa | CC BY 4.0 | Eric Chadwick; © Wayfair, LLC | Yes, with attribution |
| chair-sheen.glb | SheenChair | CC0 1.0 | Eric Chadwick; Wayfair, LLC | Yes |
| plant.glb | DiffuseTransmissionPlant | CC BY 4.0 (model) + CC0 1.0 (textures by Rico Cilliers) | Eric Chadwick; © Darmstadt Graphics Group GmbH | Yes, with attribution |
| vase-flowers.glb | GlassVaseFlowers | CC0 1.0 | Eric Chadwick; Rico Cilliers | Yes |

Attribution line (shown in the app's credits and README):
"Velvet sofa and plant models: Eric Chadwick / Wayfair LLC / Darmstadt Graphics Group GmbH, CC BY 4.0, via Khronos glTF Sample Assets."

Excluded on purpose: GlassHurricaneCandleHolder (contains the Khronos logo, a trademark); SheenWoodLeatherSofa
(downloaded and reviewed, rejected: traditional paisley chesterfield does not fit the art direction).
Licences: CC BY 4.0 https://creativecommons.org/licenses/by/4.0/ · CC0 1.0 https://creativecommons.org/publicdomain/zero/1.0/
