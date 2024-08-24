import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export const ScaleVisualizer = ({ scale, playNote }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous visualization

        const width = 300;
        const height = 300;
        const radius = Math.min(width, height) / 2 - 40;

        const g = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        const angleScale = d3.scaleLinear()
            .domain([0, scale.length])
            .range([0, 2 * Math.PI]);

        // Draw circle
        g.append("circle")
            .attr("r", radius)
            .attr("fill", "none")
            .attr("stroke", "#ccc");

        // Draw note circles
        const noteGroups = g.selectAll(".note")
            .data(scale)
            .enter().append("g")
            .attr("class", "note")
            .attr("transform", (d, i) => `rotate(${angleScale(i) * 180 / Math.PI - 90}) translate(${radius}, 0)`)
            .on("click", (event, d) => playNote(d));

        noteGroups.append("circle")
            .attr("r", 20)
            .attr("fill", "#4CAF50");

        noteGroups.append("text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(d => d)
            .attr("fill", "white");

        // Draw lines connecting notes
        const line = d3.lineRadial()
            .angle((d, i) => angleScale(i))
            .radius(radius)
            .curve(d3.curveLinearClosed);

        g.append("path")
            .datum(scale)
            .attr("fill", "none")
            .attr("stroke", "#4CAF50")
            .attr("stroke-width", 2)
            .attr("d", line);

    }, [scale, playNote]);

    return (
        <div className="scale-visualizer">
            <svg ref={svgRef} width="300" height="300"></svg>
        </div>
    );
};