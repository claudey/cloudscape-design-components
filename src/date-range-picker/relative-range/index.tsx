// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { DateRangePickerProps, Focusable } from '../interfaces';
import InternalBox from '../../box/internal';
import InternalFormField from '../../form-field/internal';
import InternalInput from '../../input/internal';
import { RadioGroupProps } from '../../radio-group/interfaces';
import InternalRadioGroup from '../../radio-group/internal';
import InternalSelect from '../../select/internal';
import InternalSpaceBetween from '../../space-between/internal';
import styles from './styles.css.js';

export interface RelativeRangePickerProps {
  dateOnly: boolean;
  options: ReadonlyArray<DateRangePickerProps.RelativeOption>;
  initialSelection: DateRangePickerProps.RelativeValue | null;
  onChange: (range: DateRangePickerProps.RelativeValue) => void;
  i18nStrings: DateRangePickerProps.I18nStrings;
  isSingleGrid: boolean;
}

interface UnitSelectOption {
  value: DateRangePickerProps.TimeUnit;
  label: string;
}

const dayUnits: ReadonlyArray<DateRangePickerProps.TimeUnit> = ['day', 'week', 'month', 'year'];
const units: ReadonlyArray<DateRangePickerProps.TimeUnit> = ['second', 'minute', 'hour', ...dayUnits];

const CUSTOM_OPTION_SELECT_KEY = 'awsui-internal-custom-duration-key';

export default forwardRef(RelativeRangePicker);

function RelativeRangePicker(
  {
    dateOnly,
    options: clientOptions = [],
    initialSelection: initialRange,
    onChange: onChangeRangeSize,
    i18nStrings,
    isSingleGrid,
  }: RelativeRangePickerProps,
  ref: React.Ref<Focusable>
) {
  const radioOptions: RadioGroupProps.RadioButtonDefinition[] = clientOptions.map(option => ({
    value: option.key,
    label: i18nStrings.formatRelativeRange(option),
  }));
  radioOptions.push({
    value: CUSTOM_OPTION_SELECT_KEY,
    label: i18nStrings.customRelativeRangeOptionLabel,
    description: i18nStrings.customRelativeRangeOptionDescription,
  });

  const [selectedRadio, setSelectedRadio] = useState(() => {
    if (initialRange && !initialRange.key) {
      return CUSTOM_OPTION_SELECT_KEY;
    }
    return initialRange?.key ?? null;
  });

  const [customDuration, setCustomDuration] = useState(() => {
    if (initialRange) {
      return initialRange.amount;
    }
    // NaN represents an empty duration
    return NaN;
  });

  const initialCustomTimeUnit = dateOnly ? 'day' : 'minute';
  const [customUnitOfTime, setCustomUnitOfTime] = useState<DateRangePickerProps.TimeUnit>(
    initialRange?.unit ?? initialCustomTimeUnit
  );

  const showRadioControl = clientOptions.length > 0;
  const showCustomControls = clientOptions.length === 0 || selectedRadio === CUSTOM_OPTION_SELECT_KEY;

  const elementRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      if (elementRef.current) {
        elementRef.current.querySelector('input')?.focus();
      }
    },
  }));

  return (
    <div ref={elementRef}>
      <InternalSpaceBetween size="xs" direction="vertical">
        {showRadioControl && (
          <InternalFormField label={i18nStrings.relativeRangeSelectionHeading}>
            <InternalRadioGroup
              className={styles['relative-range-radio-group']}
              onChange={({ detail }) => {
                setSelectedRadio(detail.value);

                if (detail.value === CUSTOM_OPTION_SELECT_KEY) {
                  setCustomDuration(NaN);
                  setCustomUnitOfTime(initialCustomTimeUnit);
                  onChangeRangeSize({
                    amount: NaN,
                    unit: initialCustomTimeUnit,
                    type: 'relative',
                  });
                } else {
                  const option = clientOptions.filter(o => o.key === detail.value)[0];
                  onChangeRangeSize(option);
                }
              }}
              value={selectedRadio}
              items={radioOptions}
            />
          </InternalFormField>
        )}

        {showCustomControls && (
          <InternalSpaceBetween direction="vertical" size="xs">
            {!showRadioControl && (
              <InternalBox fontSize="body-m" color="text-body-secondary">
                {i18nStrings.customRelativeRangeOptionDescription}
              </InternalBox>
            )}

            <div
              className={clsx(styles['custom-range'], {
                [styles['custom-range--no-padding']]: !showRadioControl,
              })}
            >
              <div
                className={clsx(styles['custom-range-form-controls'], {
                  [styles.vertical]: isSingleGrid,
                })}
              >
                <div className={styles['custom-range-duration']}>
                  <InternalFormField label={i18nStrings.customRelativeRangeDurationLabel}>
                    <InternalInput
                      type="number"
                      className={styles['custom-range-duration-input']}
                      value={isNaN(customDuration) || customDuration === 0 ? '' : customDuration?.toString()}
                      onChange={e => {
                        const amount = Number(e.detail.value);

                        setCustomDuration(amount);
                        onChangeRangeSize({ amount, unit: customUnitOfTime, type: 'relative' });
                      }}
                      placeholder={i18nStrings.customRelativeRangeDurationPlaceholder}
                    />
                  </InternalFormField>
                </div>

                <div className={styles['custom-range-unit']}>
                  <InternalFormField label={i18nStrings.customRelativeRangeUnitLabel}>
                    <InternalSelect
                      className={styles['custom-range-unit-select']}
                      selectedOption={
                        {
                          value: customUnitOfTime,
                          label: i18nStrings.formatUnit(customUnitOfTime, customDuration),
                        } as UnitSelectOption
                      }
                      onChange={e => {
                        const { value: unit } = e.detail.selectedOption as UnitSelectOption;

                        setCustomUnitOfTime(unit);
                        onChangeRangeSize({ amount: customDuration, unit, type: 'relative' });
                      }}
                      options={(dateOnly ? dayUnits : units).map(unit => ({
                        value: unit,
                        label: i18nStrings.formatUnit(unit, customDuration),
                      }))}
                      renderHighlightedAriaLive={option => option.label || option.value || ''}
                    />
                  </InternalFormField>
                </div>
              </div>
            </div>
          </InternalSpaceBetween>
        )}
      </InternalSpaceBetween>
    </div>
  );
}
