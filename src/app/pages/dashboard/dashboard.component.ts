import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ChoreographiesService } from '../../services/choreographies.service';
import { SourcesService } from '../../services/sources.service';
import { Statement } from '../../types/core.types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  responseStatisticsOptions!: EChartsOption;
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

          this.responseStatisticsOptions = {
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
}
