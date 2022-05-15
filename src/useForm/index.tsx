import React, { useRef, useState, useEffect, useCallback, forwardRef, cloneElement } from 'react';
import Validator, { Rules, ValidateOption, ErrorList } from 'async-validator';
import set from 'lodash/set';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { FieldMeta, Fields, Errors, Options } from './types';

const VirtualField = forwardRef(
  (
    {
      unRegisterField,
      children,
    }: {
      unRegisterField: () => void;
      children: React.ReactElement;
    },
    ref,
  ) => {
    useEffect(() => {
      return () => unRegisterField();
    }, []);

    return cloneElement(children, { ref });
  },
);

const useForm = function <Values extends {}>(options?: Options<Values>) {
  const { onValuesChange } = options || ({} as Options<Values>);

  const fieldsMeta = useRef<{ [name: string]: FieldMeta<Values> }>({}); // 平铺结构
  const fieldsRef = useRef<{ [name: string]: any }>({}); // 平铺结构
  const touchedFields = useRef<{ [name: string]: boolean }>({}); // 平铺结构，字段经交互变更
  const [fields, setFields] = useState<Values>({} as Values);
  const [errors, setErrors] = useState<Errors>({});
  const [shouldFlush, setShouldFlush] = useState<boolean>(false);

  /**
   * 利用 useEffect 刷新 state，willUnmount 中取得的 state 为历史数据（闭包引起）
   * 但这样做会造成两次渲染
   */
  useEffect(() => {
    if (shouldFlush) {
      const newValues = getFieldsValue();
      const newErrors = getFieldsError();
      setFields(newValues);
      setErrors(newErrors);
      onValuesChange && onValuesChange(newValues);
    }
  }, [shouldFlush]);

  /**
   * 注册
   * @param name
   * @param meta
   */
  const registerField = useCallback(
    (name: string, meta?: FieldMeta<Values>) => {
      setFieldMeta(name, meta || {});

      return () => {
        unRegisterField(name);
      };
    },
    [fieldsMeta],
  );

  /**
   * 销毁
   * @param name
   * @param meta
   */
  const unRegisterField = useCallback(
    (name: string) => {
      setShouldFlush(true);
      delete fieldsMeta.current[name];
    },
    [fieldsMeta],
  );

  /**
   * 获取字段名
   * @param names
   */
  const getFieldsName = useCallback(
    (names?: string[]) => {
      return names ? names : Object.keys(fieldsMeta.current);
    },
    [fieldsMeta],
  );

  /**
   * 设置元数据
   * @param name
   * @param key
   * @param value
   */
  const setFieldMeta = useCallback(
    (name: string, key: string | FieldMeta<Values>, value?: any) => {
      if (typeof key !== 'string') {
        fieldsMeta.current[name] = key || {};
      } else if (typeof key === 'string') {
        if (!fieldsMeta.current[name]) fieldsMeta.current[name] = {};
        const meta: FieldMeta<Values> = fieldsMeta.current[name];
        meta[key] = value;
      }
    },
    [fieldsMeta],
  );

  /**
   * 获取元数据
   * @param name
   * @param key
   */
  const getFieldMeta = useCallback(
    (name: string, key?: string) => {
      const meta = fieldsMeta.current[name];
      if (meta) {
        if (key) return meta[key];
        return meta;
      }

      // 对嵌套数据的父属性，转换处理，使元数据有值，意为父属性字段存在
      const fieldsMetaData = {};
      getFieldsName().forEach((fieldName) => {
        set(fieldsMetaData, fieldName, fieldsMeta.current[fieldName]);
      });
      const fieldMeta = get(fieldsMetaData, name);
      if (key) return fieldMeta[key];
      return fieldMeta;
    },
    [fieldsMeta],
  );

  /**
   * 校验字段，内部
   * @param names
   */
  const _validate = useCallback(
    (names?: string[], vals?: Values, validateOption?: ValidateOption): Promise<Values> => {
      const fieldsName = getFieldsName(names); // 平铺结构
      const values: Values = vals ? vals : ({} as Values);
      const rules: Rules = {};
      const innerValidateOption: ValidateOption = validateOption ? validateOption : {};

      fieldsName.forEach((name: string) => {
        if (!vals) values[name] = getFieldValue(name);
        const fieldRules = getFieldMeta(name, 'rules');
        if (fieldRules) rules[name] = fieldRules;
        if (!validateOption) {
          const validateFirst = getFieldMeta(name, 'validateFirst');
          if (validateFirst) innerValidateOption.first = validateFirst;
        }
      });

      return new Promise((resolve, reject) => {
        new Validator(rules).validate(values, validateOption, (errorList: ErrorList) => {
          if (!errorList) {
            const errs = { ...errors };
            getFieldsName(names).forEach((name) => {
              set(errs, name, undefined);
            });
            setErrors(errs);
            resolve(values);
          } else {
            const errs: { [key: string]: string[] } = {};
            errorList.forEach(({ field, message }) => {
              if (!errs[field]) errs[field] = [message];
              else errs[field].push(message);
            });

            const newErrors = { ...errors };
            getFieldsName(names).forEach((name) => {
              if (errs[name]) set(newErrors, name, errs[name]);
              else set(newErrors, name, undefined);
            });

            setErrors(newErrors);

            reject({
              errors: newErrors,
              values,
            });
          }
        });
      });
    },
    [fieldsMeta, fields, errors],
  );

  /**
   * 校验字段
   * @param names
   */
  const validateFields = useCallback(
    (names?: string[], validateOption?: ValidateOption): Promise<Values> => {
      const values: Values = {} as Values;
      if (names) {
        getFieldsName(names).forEach((name: string) => {
          values[name] = getFieldValue(name);
        });
      }

      return _validate(names, names ? values : undefined, validateOption);
    },
    [fieldsMeta, fields, errors],
  );

  /**
   * 校验字段
   * @param name
   * @param value
   */
  const validateField = useCallback(
    (name: string, value?: any): Promise<Values> => {
      // @ts-ignore
      return _validate([name], {
        [name]: value !== undefined ? value : getFieldValue(name),
      });
    },
    [fieldsMeta, fields, errors],
  );

  /**
   * 字段组件装饰器
   * @param name
   * @param meta
   */
  const getFieldDecorator = useCallback(
    (name: string, meta: FieldMeta<Values> = {} as FieldMeta<Values>) => {
      registerField(name, meta);
      const {
        trigger = 'onChange',
        validateTrigger = 'onChange',
        valuePropName = 'value',
        getValueFromEvent = (e: any) => (e && e.target ? e.target[valuePropName] : e),
        normalize,
      } = meta;

      return (inst: React.ReactElement) => {
        const instProps = inst.props;
        const value = getFieldValue(name);
        const defaultValue = getFieldInitialValue(name);

        const props = {
          ...instProps,
          defaultValue: normalize ? normalize(defaultValue) : defaultValue,
          [valuePropName]: normalize ? normalize(value) : value,
          [trigger]: (...args: any[]) => {
            instProps[trigger] && instProps[trigger](...args);
            const value = getValueFromEvent ? getValueFromEvent(...args) : args[0];
            setFieldValue(name, value);
          },
        };

        const originMethod = props[validateTrigger];
        props[validateTrigger] = (...args: any[]) => {
          originMethod && originMethod(...args);
          const value = getValueFromEvent ? getValueFromEvent(...args) : args[0];
          validateField(name, value);
        };

        const saveRef = (ref: any) => {
          if (instProps.ref && typeof instProps.ref == 'function') {
            instProps.ref(ref);
          }

          setFieldRef(name, ref);
        };
        props.ref = saveRef;

        const PropsForAntd3FormItem = {
          'data-name': name,
          'data-__field': {
            errors: errors[name]?.map((message) => ({ message })),
            value: fields[name],
          },
          'data-__meta': {
            validate: [
              {
                rules: meta.rules,
              },
            ],
          },
        };

        return (
          <VirtualField
            unRegisterField={() => {
              unRegisterField(name);
            }}
            {...PropsForAntd3FormItem}
          >
            {React.cloneElement(inst, props)}
          </VirtualField>
        );
      };
    },
    [fieldsMeta, fields, errors, fieldsRef],
  );

  /**
   * 设置字段引用
   * @param name
   * @param ref
   */
  const setFieldRef = useCallback(
    (name: string, ref: any) => {
      if (ref) {
        fieldsRef.current[name] = ref;
      } else {
        delete fieldsRef.current[name];
      }
    },
    [fieldsRef],
  );

  /**
   * 获取字段的 ref
   * @param name
   */
  const getFieldRef = useCallback(
    (name: string) => {
      return fieldsRef.current[name];
    },
    [fieldsRef],
  );

  /**
   * 是否有交互行为发生，或手动设置过值
   * @param name
   */
  const isFieldTouched = useCallback(
    (name: string) => {
      return !!get(touchedFields.current, name);
    },
    [touchedFields],
  );

  /**
   * 是否有交互行为发生，或手动设置过值
   */
  const isFieldsTouched = useCallback(() => {
    return Object.keys(touchedFields.current).some((name: string) => {
      return !!get(touchedFields.current, name);
    });
  }, [touchedFields]);

  /**
   * 获取值
   */
  const getFieldsValue = useCallback(() => {
    const values: Values = {} as Values;
    const names = getFieldsName();
    names.forEach((name) => {
      set(values, name, getFieldValue(name));
    });
    return values;
  }, [fieldsMeta, fields]); // fieldsMeta 若不作为依赖，没法获取最新的值

  /**
   * 获取值。设置 initialValue 初始值会引起 getFieldValue 数据变更，但不会引起重绘
   * @param name
   */
  const getFieldValue = useCallback(
    (name: string) => {
      const fieldMeta = getFieldMeta(name);
      if (!fieldMeta) return;
      const fieldInitialValue = getFieldInitialValue(name);
      const fieldValue = get(fields, name);
      return isFieldTouched(name) ? fieldValue : fieldInitialValue;
    },
    [fieldsMeta, fields],
  );

  /**
   * 获取初始值
   */
  const getFieldsInitialValue = useCallback(() => {
    const initialValues: Values = {} as Values;
    getFieldsName().forEach((name) => {
      set(initialValues, name, getFieldMeta(name, 'initialValue'));
    });

    return initialValues;
  }, [fieldsMeta]);

  /**
   * 获取初始值
   * @param name
   */
  const getFieldInitialValue = useCallback(
    (name: string) => {
      const initialValues = getFieldsInitialValue();
      return get(initialValues, name);
    },
    [fieldsMeta],
  );

  /**
   * 获取错误文案
   */
  const getFieldsError = useCallback(() => {
    const errs: Errors = {};
    const names = getFieldsName();
    names.forEach((name) => {
      set(errs, name, get(errors, name));
    });
    return errs;
  }, [fieldsMeta, errors]);

  /**
   * 获取错误文案
   * @param name
   */
  const getFieldError = useCallback(
    (name: string) => {
      const fieldMeta = getFieldMeta(name);
      if (!fieldMeta) return;
      return get(errors, name);
    },
    [fieldsMeta, errors],
  );

  /**
   * 设置字段的值
   * @param name
   * @param value
   * @param touched
   */
  const setFieldValue = useCallback(
    (name: string, value: any) => {
      if (!touchedFields.current[name]) {
        set(touchedFields.current, name, true);
      }

      const values = getFieldsValue();
      set(values, name, value);
      setFields(values);
      onValuesChange && onValuesChange(values);
    },
    [fieldsMeta, fields, touchedFields],
  );

  /**
   * 设置字段的值
   * @param vals
   */
  const setFieldsValue = useCallback(
    (vals: Fields) => {
      // Object.keys(vals) 是因为元数据尚且没有该字段的情况
      [...getFieldsName(), ...Object.keys(vals)].forEach((name) => {
        if (!touchedFields.current[name] && get(vals, name)) {
          set(touchedFields.current, name, true);
        }
      });

      const values = {
        ...getFieldsValue(),
        ...vals,
      };
      setFields(values);
      onValuesChange && onValuesChange(values);
    },
    [fieldsMeta, fields, touchedFields],
  );

  /**
   * 重置为初始值
   */
  const resetFields = useCallback(() => {
    const values: Values = {} as Values;

    getFieldsName().forEach((name: string) => {
      values[name] = getFieldInitialValue(name);
    });

    touchedFields.current = {};
    setFields(values);
    setErrors({});
  }, [fieldsMeta]);

  /**
   * 判断表单是否变更
   */
  const isFormChanged = useCallback((): boolean => {
    const values = getFieldsValue();
    return getFieldsName().some((name: string) => {
      const initialValue = getFieldInitialValue(name);
      const value = get(values, name);
      return !isEqual(value, initialValue);
    });
  }, [fieldsMeta, fields]);

  return {
    registerField,
    unRegisterField,
    setFieldMeta,
    getFieldMeta,
    getFieldDecorator,
    getFieldRef,
    getFieldsValue,
    getFieldValue,
    getFieldInitialValue,
    getFieldsError,
    getFieldError,
    setFieldValue,
    setFieldsValue,
    resetFields,
    validateField,
    validateFields,
    isFormChanged,
    isFieldTouched,
    isFieldsTouched,
  };
};

export default useForm;
