import { Component, Input, Inject, forwardRef, Optional } from '@angular/core';

import { connectSortBy } from 'instantsearch.js/es/connectors';
import { TypedBaseWidget } from '../typed-base-widget';
import { NgAisInstantSearch } from '../instantsearch/instantsearch';
import { NgAisIndex } from '../index-widget/index-widget';
import { noop } from '../utils';
import {
  SortByConnector,
  SortByConnectorParams,
  SortByWidgetDescription,
  SortByRenderState,
  SortByItem,
} from 'instantsearch.js/es/connectors/sort-by/connectSortBy';
import { CommonModule } from '@angular/common';

export {
  SortByConnector,
  SortByConnectorParams,
  SortByWidgetDescription,
  SortByRenderState,
  SortByItem,
};

@Component({
  selector: 'ais-sort-by',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cx()">
      <select [class]="cx('select')" (change)="handleChange($event)">
        <option
          [class]="cx('option')"
          *ngFor="let item of state.options"
          [value]="item.value"
          [selected]="item.value === state.currentRefinement"
        >
          {{ item.label }}
        </option>
      </select>
    </div>
  `,
})
export class NgAisSortBy extends TypedBaseWidget<
  SortByWidgetDescription,
  SortByConnectorParams
> {
  @Input() public items!: SortByItem[];
  @Input()
  public transformItems?: <U extends SortByItem>(items: SortByItem[]) => U[];

  public override state: SortByRenderState = {
    currentRefinement: '',
    options: [],
    refine: noop,
    hasNoResults: false,
    canRefine: false,
  };

  constructor(
    @Inject(forwardRef(() => NgAisIndex))
    @Optional()
    public parentIndex: NgAisIndex,
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchInstance: NgAisInstantSearch
  ) {
    super('SortBy');
  }

  public override ngOnInit() {
    this.createWidget(
      connectSortBy,
      {
        items: this.items,
        transformItems: this.transformItems,
      },
      {
        $$widgetType: 'ais.sortBy',
      }
    );
    super.ngOnInit();
  }

  handleChange(event: Event) {
    this.state.refine((event.target as HTMLSelectElement).value);
  }
}
