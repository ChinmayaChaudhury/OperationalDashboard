class Axis {
    constructor(ticks) {
        this.ticks = ticks;
    }

    CreateScale(from, to) {
        this.scale =
            d3.scalePoint()
                .domain(this.ticks)
                .range([from, to])
            ;
    }

    Render(parent) {
        let axis = parent
            .append("g")
            .attr("class", "axis");

        let ticks = axis
            .selectAll(".ticks")
            .data(this.ticks)
            .enter()
            .append("text")
            .text(d => d)
            .attr("class", "ticks")
            .attr("x", d => this.scale(d))
    }
}

class Section {
    constructor(width, height, background) {
        this.width = width;
        this.height = height;
        this.background = background;
        this.segments = [];
        this.axes = [];
    }

    AddAxis(axis) {
        this.axes.push(axis);
    }

    AddSegments(segments) {
        for (const [id, segment] of segments.entries()) {
            this.segments.push({ index: id + 1, markers: segment });
        }

        this.CreateScale();
        this.GenerateSegmentPoints();
    }

    CreateScale() {
        this.scale =
            d3.scaleBand()
                .domain(this.segments.map(d => d.index))
                .range([0, this.width]);
    }

    GenerateSegmentPoints() {
        let sPoints = [];

        for (let i = 0; i < this.segments.length; i++) {
            let iPoints = [{ x: this.scale(this.segments[i].index), y: this.height / 2 }];

            if (this.segments[i + 1] != undefined) {
                iPoints.push({ x: this.scale(this.segments[i + 1].index), y: this.height / 2 })
            } else {
                iPoints.push({ x: this.width, y: this.height / 2 })
            }

            sPoints.push(iPoints);
        }

        return sPoints;
    }

    Render(parent) {
        // Needed to access the data from within each() without losing reference to the selected el.
        const segmentsData = this.segments;
        const markersData = () => {
            let markers = [];

            for (const [i, segment] of segmentsData.entries()) {
                for (const [j, marker] of segment.markers.entries()) {
                    if (marker.position == "start") {
                        marker['x-coordinate'] = this.scale(segment.index);
                    } else {
                        if (i == segmentsData.length - 1) {
                            marker['x-coordinate'] = this.width;
                        } else {
                            marker['x-coordinate'] = this.scale(segment.index + 1);
                        }
                    }

                    markers.push(marker);
                }
            }

            return markers;
        }

        // Group rendered objects
        let section = parent
            .append("g")
            .attr("class", "section");


        // Render background
        if (this.background) {
            let background = section
                .append("rect")
                .attr("width", this.width)
                .attr("height", this.height - 5)
                .attr("class", "background");
        }

        // Render horizontal lines
        let horizontalLines = section
            .selectAll("path.horizontal")
            .data(this.GenerateSegmentPoints())
            .enter()
            .append("path")
            .attr("d", d3.line().x(d => d.x).y(d => d.y))
            .attr("id", (d, i) => `horizontal-line-${++i}`)
            .attr("class", "horizontal");

        // Render markers
        let markers = horizontalLines
            .each(function (d, i) {
                let line = d3.select(this)

                for (const marker of segmentsData[i].markers) {
                    if (marker.position == "start") {
                        line.attr("marker-start", "url(#segment)");
                    } else {
                        line.attr("marker-end", "url(#segment)");
                    }
                }
            });

        // Render vertical lines
        let verticalLines = section
            .selectAll("line.vertical")
            .data(markersData())
            .enter()
            .append("line")
            .attr("x1", d => d['x-coordinate'])
            .attr("y1", (this.height / 2)  - 100)
            .attr("x2", d => d['x-coordinate'])
            .attr("y2", this.height)
            .attr("id", (d, i) => {
                return `vertical-line-${++i}`;
            })
            .attr("class", "vertical");

        // Render data labels (TODO: fix alignment)
        let labels = section
            .selectAll("text")
            .data(markersData())
            .enter()
            .append("text")
            .text(d => {
                return d.label;
            })
            .attr("x", d => d['x-coordinate'])
            .attr("y", this.height / 2)
            .attr("transform", d => d.icon == undefined ? `translate(${0}, ${-10})` : `translate(${12.5}, ${-10})`)
            .attr("class", "labels");

        // Render icons
        let icons = section
            .selectAll(".icon")
            .data(markersData())
            .enter()
            .append("image")
            .attr("x", d => d['x-coordinate'])
            .attr("y", this.height / 2)
            .attr("transform", `translate(${-8}, ${-22.5})`)
            .attr("class", "icon")
            .attr("width", "17.5px")
            .attr("height", "17.5px")
            .attr("href", d => d.icon);

        // Render axes
        for (const axis of this.axes) {

            axis.CreateScale(-10, this.width - 2.5)
            axis.Render(section);
        }

        // Render axes
        d3.selectAll(".axis")
            .attr("transform", (d, i) => `translate(${0}, ${this.height / 2 + 15 + (i * 12.5)})`)
            .attr("id", (d, i) => `axis-${++i}`);
    }
}

class Timeline {
    constructor(dimension, margin) {
        this.dimension = dimension;
        this.margin = margin;
        this.sections = [];
        this.definitions = [];
    }

    AddSection(section) {
        this.sections.push(section);
    }

    AddDefinition(definition) {
        this.definitions.push(definition);
    }

    Render(parent) {
        // Render canvas
        let canvas =
            d3.select(parent)
                .append("svg")
                .attr("width", this.dimension.width + this.margin.left + this.margin.right)
                .attr("height", this.dimension.height + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("class", "timeline")
                .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        // Add user definitions
        let definitions =
            canvas
                .append("defs");

        this.definitions.forEach(definition => {
            definition.call(definition, definitions);
        });

        // Add a definition for markers
        let markers =
            definitions
                .append("marker")
                .attr("id", "segment")
                .attr("markerWidth", 10)
                .attr("markerHeight", 10)
                .attr("refX", 5)
                .attr("refY", 5)
                .attr("class", "gray-marker")
                .append("circle")
                .attr("cx", 5)
                .attr("cy", 5)
                .attr("r", 3);

        // Render each section
        let offset = 0;

        for (const [id, section] of this.sections.entries()) {
            section.Render(canvas);

            // Groups were used to facilitate horizontal translation
            d3.select(".section:last-child")
                .attr("id", `section-${id + 1}`)
                .attr("transform", `translate(${offset}, 0)`);

            offset += section.width;
        }
    }
}