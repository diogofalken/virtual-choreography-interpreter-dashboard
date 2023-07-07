import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ChoreographiesService } from '../../services/choreographies.service';
import { SourcesService } from '../../services/sources.service';
import { Recipe, Statement } from '../../types/core.types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  recipeStatisticsOptions!: EChartsOption;
  recipeGraphOptions!: EChartsOption;
  choreographiesStatisticsOptions!: EChartsOption;

  choreographiesDistributionInTimeOptions!: EChartsOption;

  constructor(
    private readonly sourcesService: SourcesService,
    private readonly choreographiesService: ChoreographiesService
  ) {}

  ngOnInit(): void {
    this.sourcesService.sourceId$.subscribe((sourceId) => {
      this.sourcesService.getSource(sourceId, { recipe: true }).subscribe({
        next: (response) => {
          if (!response.recipe) return;

          this.recipeStatisticsOptions = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
              },
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true,
            },
            xAxis: [
              {
                type: 'category',
                data: ['Actors', 'Verbs', 'Objects', 'Places'],
                axisTick: {
                  alignWithLabel: true,
                },
              },
            ],
            yAxis: [
              {
                type: 'value',
              },
            ],
            series: [
              {
                name: 'Amount',
                type: 'bar',
                barWidth: '60%',
                data: [
                  response.recipe.actors.length,
                  response.recipe.verbs.length,
                  response.recipe.objects.length,
                  response.recipe.places.length,
                ],
              },
            ],
          };

          const graphData = this.getGraphRecipeData(response.recipe);
          this.recipeGraphOptions = {
            title: {},
            tooltip: {},
            legend: [
              {
                // selectedMode: 'single',
                data: graphData.categories.map(function (a: { name: string }) {
                  return a.name;
                }),
              },
            ],
            animationDuration: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
              {
                name: 'Generated Recipe',
                type: 'graph',
                layout: 'force',
                data: graphData.nodes,
                links: graphData.links,
                categories: graphData.categories,
                roam: true,
                label: {
                  position: 'right',
                  formatter: '{b}',
                },
                lineStyle: {
                  color: 'source',
                  curveness: 0.3,
                },
                emphasis: {
                  focus: 'adjacency',
                  lineStyle: {
                    width: 10,
                  },
                },
                force: {
                  repulsion: 100,
                },
              },
            ],
          };
        },
        error: (error) => {
          console.log(error);
        },
      });
    });

    this.sourcesService.sourceId$.subscribe((sourceId) => {
      this.choreographiesService.getChoreographies(sourceId).subscribe({
        next: () => {
          const choreographies = this.choreographiesService.choreographies;

          this.choreographiesStatisticsOptions = {
            legend: {
              top: 'bottom',
            },
            toolbox: {
              show: true,
              feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true },
              },
            },
            series: [
              {
                name: 'Choreographies Identified',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2,
                },
                label: {
                  show: false,
                  position: 'center',
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: 20,
                    fontWeight: 'bold',
                  },
                },
                labelLine: {
                  show: false,
                },
                data: Array.from(choreographies.keys()).map((tab) => ({
                  value: choreographies.get(tab)?.length,
                  name: tab,
                })),
              },
            ],
          };

          const counters = this.choreographieTimeDistribution(choreographies);

          this.choreographiesDistributionInTimeOptions = {
            legend: {},
            tooltip: {},
            dataset: {
              source: [
                ['Time period', ...counters.keys],
                ['06h00 - 11h59', ...counters.morning],
                ['12:00 - 17:59', ...counters.afternoon],
                ['18:00 - 21:59', ...counters.evening],
                ['22:00 - 05:59', ...counters.night],
              ],
            },
            xAxis: { type: 'category' },
            yAxis: {},
            series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
          };
        },
        error: (error) => {
          console.log(error);
        },
      });
    });
  }

  private choreographieTimeDistribution(
    choreographies: Map<
      string,
      { naturalLanguage: string; statement: Statement }[][]
    >
  ) {
    const choreographyKeys = Array.from(choreographies.keys());

    const morningCounters = Array.from(Array(choreographyKeys.length)).fill(0);
    const afternoonCounters = Array.from(Array(choreographyKeys.length)).fill(
      0
    );
    const eveningCounters = Array.from(Array(choreographyKeys.length)).fill(0);
    const nightCounters = Array.from(Array(choreographyKeys.length)).fill(0);

    for (const [key, keyChoreographies] of choreographies.entries()) {
      for (const choreography of keyChoreographies) {
        const statement = choreography.at(-1);

        if (!statement) continue;

        const date = new Date(statement.statement.context.extensions.timestamp);
        const hour = date.getHours();
        const keyIndex = choreographyKeys.indexOf(key);
        if (hour >= 6 && hour < 12) {
          morningCounters[keyIndex] += 1;
        } else if (hour >= 12 && hour < 18) {
          afternoonCounters[keyIndex] += 1;
        } else if (hour >= 18 && hour < 22) {
          eveningCounters[keyIndex] += 1;
        } else {
          nightCounters[keyIndex] += 1;
        }
      }
    }

    return {
      keys: choreographyKeys,
      morning: morningCounters,
      afternoon: afternoonCounters,
      evening: eveningCounters,
      night: nightCounters,
    };
  }

  private getGraphRecipeData(recipe: Recipe) {
    const nodes: {
      id: string;
      name: string;
      value: number;
      symbolSize?: number;
      category: number;
      label?: { show: true };
    }[] = [
      {
        id: '0',
        name: 'Actors',
        value: 3,
        symbolSize: 30,
        category: 0,
        label: { show: true },
      },
      {
        id: '1',
        name: 'Verbs',
        value: 3,
        symbolSize: 30,
        category: 1,
        label: { show: true },
      },
      {
        id: '2',
        name: 'Objects',
        value: 3,
        symbolSize: 30,
        category: 2,
        label: { show: true },
      },
      {
        id: '3',
        name: 'Places',
        value: 3,
        symbolSize: 30,
        category: 3,
        label: { show: true },
      },
    ];
    let i = nodes.length;
    const links = [
      {
        source: '0',
        target: '1',
      },
      {
        source: '1',
        target: '2',
      },
      {
        source: '2',
        target: '3',
      },
      {
        source: '3',
        target: '0',
      },
    ];

    for (const actor of recipe.actors) {
      nodes.push({
        id: actor.id,
        name: actor.name,
        value: 1,
        symbolSize: 10,
        category: 0,
      });
      links.push({
        source: actor.id,
        target: '0',
      });
    }
    for (const verb of recipe.verbs) {
      nodes.push({
        id: verb.id,
        name: verb.display,
        value: 1,
        symbolSize: 10,
        category: 1,
      });
      links.push({
        source: verb.id,
        target: '1',
      });
    }
    for (const object of recipe.objects) {
      nodes.push({
        id: object.id,
        name: object.definition.name,
        value: 1,
        symbolSize: 10,
        category: 2,
      });
      links.push({
        source: object.id,
        target: '2',
      });
    }
    for (const place of recipe.places) {
      nodes.push({
        id: place.id,
        name: place.name,
        value: 1,
        symbolSize: 10,
        category: 3,
      });
      links.push({
        source: place.id,
        target: '3',
      });
    }
    return {
      type: 'force',
      categories: [
        {
          name: 'Actors',
          base: 'Actors',
        },
        {
          name: 'Verbs',
          base: 'Verbs',
        },
        {
          name: 'Objects',
          base: 'Objects',
        },
        {
          name: 'Places',
          base: 'Places',
        },
      ],
      nodes,
      links,
    };
  }
}
