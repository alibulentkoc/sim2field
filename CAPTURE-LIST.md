# SIM2FIELD Capture Shopping List

The 8 capture-preferred figure slots are deliberately not fabricated: each needs a
real photograph, CAD export, or measured field/lab data. Until the asset exists the
slot stays a spec placeholder - it appears only as a text row in its module's figure
table, not as a rendered figure (0 spec slots in the shipped HTML). When an asset is
supplied it binds into its module's inline-figure slot via the same render pipeline.

```
+=========+============================+==============+=======================+==============================================+=========+
| ID      | Title                      | Anchor       | Asset type            | What the image must show                     | Placeh. |
+=========+============================+==============+=======================+==============================================+=========+
| F-M2-1  | Watermelon anatomy & load  | M2 6.1       | Photo or labeled      | Real watermelon cross-section:               | none    |
|         | path                       |              | illustration          | rind/flesh/seed/vascular anatomy and the     |         |
|         |                            |              |                       | load path through the fruit.                 |         |
+---------+----------------------------+--------------+-----------------------+----------------------------------------------+---------+
| F-M2-7  | Fruit mass/size            | M2 7.5       | Measured field data   | Histogram of the cultivar population's       | none    |
|         | distribution & design      |              |                       | mass/size with design percentiles marked.    |         |
|         | percentiles                |              |                       |                                              |         |
+---------+----------------------------+--------------+-----------------------+----------------------------------------------+---------+
| F-M4-6  | Sim-to-real: synthetic vs. | M4 12        | Measured data (model  | Real eval numbers from trained models:       | none    |
|         | real performance and the   |              | eval)                 | synthetic vs real detection performance and  |         |
|         | gap                        |              |                       | the gap.                                     |         |
+---------+----------------------------+--------------+-----------------------+----------------------------------------------+---------+
| F-M10-1 | Drive-over platform and    | M10 6.1/6.2  | Photo or CAD export   | The Amiga drive-over platform and how fruit  | none    |
|         | staging to the pick        |              |                       | is staged to the pick station.               |         |
|         | station                    |              |                       |                                              |         |
+---------+----------------------------+--------------+-----------------------+----------------------------------------------+---------+
| F-M13-1 | The integrated machine     | M13 6.1      | CAD export or photo   | The assembled machine showing all subsystems | none    |
|         | (all subsystems,           |              |                       | and their interfaces.                        |         |
|         | interfaces)                |              |                       |                                              |         |
+---------+----------------------------+--------------+-----------------------+----------------------------------------------+---------+
| F-M13-6 | Twin<->real correspondence | M13 6.7      | Measured data (twin   | Paired twin-vs-real measurements:            | none    |
|         | & per-rung reality gap     |              | vs real)              | correspondence and per-rung reality gap      |         |
|         | (CR-03 closed)             |              |                       | (CR-03 closed).                              |         |
+---------+----------------------------+--------------+-----------------------+----------------------------------------------+---------+
| F-M16-6 | Lifecycle assessment       | M16 6.7      | Measured data (LCA    | LCA inventory (materials, energy, end-of-    | none    |
|         | (footprint by stage)       |              | inventory)            | life) as footprint by lifecycle stage.       |         |
+---------+----------------------------+--------------+-----------------------+----------------------------------------------+---------+
| F-M17-1 | The complete machine with  | M17 6.1      | Render or photo       | Final integrated-machine render/photo,       | none    |
|         | the six CECs located       |              | (annotated)           | annotated to locate the six CECs.            |         |
+---------+----------------------------+--------------+-----------------------+----------------------------------------------+---------+
```

Notes:
- Anchor = module + figure-table section(s) where the image is placed.
- Placeh. (committed placeholder caption) = none for all 8; no fabricated image exists.
- Sources: figure-inventory.html capture-preferred notes + each module's figure table
  (MODULE-02/04/10/13/16/17). The manifest media catalogue lists all 8 as status "slot".

By asset type:
- Fruit photo/illustration (1): F-M2-1.
- Machine CAD/photo/render (3): F-M10-1, F-M13-1, F-M17-1.
- Measured data (4): F-M2-7 (field histogram), F-M4-6 (model eval), F-M13-6 (twin vs
  real), F-M16-6 (LCA inventory).
