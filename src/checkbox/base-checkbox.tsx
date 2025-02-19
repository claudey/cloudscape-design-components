// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';
import { FormFieldControlProps } from '../internal/context/form-field-context';

export interface BaseCheckboxProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * Specifies if the component is selected.
   */
  checked: boolean;

  /**
   * Specifies the name of the control used in HTML forms.
   */
  name?: string;

  /**
   * Specifies if the control is disabled, which prevents the
   * user from modifying the value and prevents the value from
   * being included in a form submission. A disabled control can't
   * receive focus.
   */
  disabled?: boolean;

  /**
   * Specifies the ID of the native form element. You can use it to relate
   * a label element's `for` attribute to this control.
   *
   * It defaults to an automatically generated ID that
   * is provided by its parent form field component.
   */
  controlId?: string;

  /**
   * Adds an `aria-label` to the native control.
   *
   * Use this if you don't have a visible label for this control.
   */
  ariaLabel?: string;

  /**
   * Called when input focus is moved to the UI control.
   */
  onFocus?: NonCancelableEventHandler;

  /**
   * Called when input focus is removed from the UI control.
   */
  onBlur?: NonCancelableEventHandler;

  children?: React.ReactNode;

  /**
   * Description that appears below the label.
   */
  description?: React.ReactNode;
}
