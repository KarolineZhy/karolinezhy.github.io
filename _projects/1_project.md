---
layout: page
title: Pixel-Wise Ultrasound Narration with LVLM
# description: with background image
img: assets/img/project1/image_ultrasound.png
importance: 1
category: work
related_publications: true
---

**Introduction**

Recent advances in large language models (LLMs) and multi-modal AI present a unique opportunity to bridge this gap. By leveraging the contextual understanding and reasoning capabilities of LLMs, combined with pixel-level image analysis, we propose a novel system for pixel-wise ultrasound narration—automatically generating detailed, region-specific clinical descriptions directly from ultrasound images.

**Motivation and Background**

Traditional computer-aided ultrasound analysis has primarily focused on tasks such as classification, segmentation, or basic detection. While effective for specific objectives, these approaches often fail to produce comprehensive, human-readable narratives that capture the nuanced observations a radiologist would include in a diagnostic report. With the advent of vision-language and foundation models capable of fine-grained image captioning, there is growing potential to bridge this gap. However, it remains unclear how to perform captioning and spatial localization simultaneously in a coherent and clinically meaningful manner—particularly in the context of dense, real-time ultrasound imagery.

Our project aims to harness the capabilities of LLMs—augmented with spatial awareness and fine-tuned on medical image-text pairs—to generate pixel-aligned descriptive narratives. This not only supports diagnostic workflows but also lays the groundwork for an intelligent sonographer system: an AI assistant that can interpret, explain, and even guide ultrasound acquisition in real time.

**Task**

- Dataset preparation
- Training pixel-aligned narration model 

<div>
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/project1/pipeline.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Pixel-aligned Narration
</div>
