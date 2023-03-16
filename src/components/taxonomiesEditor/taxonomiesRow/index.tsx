import { useEffect, useState } from 'react';
// Styles
import classes from './TaxonomiesRow.module.scss';

// Utils
import { useAppDispatch } from '../../../utils/useAppDispatch';
import { useAppSelector } from '../../../utils/useAppSelector';

// redux
import {
  addNewTaxonomy,
  deleteTaxonomy,
  updateTaxonomyGrandParent,
  updateTaxonomyLabel,
  updateTaxonomyParent,
} from '../../../redux/slices/taxonomies';

// Components
import Separator from '../../shared/separator';
import { CustomSelectSingle } from '../../shared/customSelectSingle';
import { Taxonomy } from '../../../types/Taxonomies';

const TaxonomiesRow = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [taxonomyLabelError, setTaxonomyLabelError] = useState<boolean>(false);
  const [labelNameError, setLabelNameError] = useState<boolean>(false);
  const [errorIndex, setErrorIndex] = useState<number>(-1);

  const taxonomies = useAppSelector((state) => state.taxonomies.taxonomies);

  //

  useEffect(() => {
    taxonomies.length === 0 &&
      dispatch(
        addNewTaxonomy({
          label: '',
          parent: '',
          grandParent: '',
          updatedAt: Date.now(),
          solanaAddress: '',
          arweaveAddress: '',
          publicKey: '',
        })
      );
  });

  const findParent = (parent: any) => {
    const parentIndex = taxonomies.findIndex(
      (taxonomy: any) => taxonomy.label.toLowerCase() === parent
    );
    if (parentIndex !== -1) {
      return taxonomies[parentIndex].parent;
    }
    return '';
  };

  const onChangeTaxonomyHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = event.target;
    if (name === 'label' && value !== '') {
      setTaxonomyLabelError(false);
    }

    const newTaxonomy = {
      [name]: value.trimStart(),
      grandparent: '',
      index,
    };
    if (newTaxonomy.hasOwnProperty('label')) {
      dispatch(updateTaxonomyLabel(newTaxonomy));
    }
    if (newTaxonomy.hasOwnProperty('parent')) {
      dispatch(updateTaxonomyParent(newTaxonomy));
      const grandParent = findParent(newTaxonomy.parent);
      dispatch(updateTaxonomyGrandParent({ grandParent, index }));
    }

    const labelNames = taxonomies.map(taxonomy => taxonomy.label.toLowerCase().trim())

    let labelDuplicates = (labelNames: any[]) => labelNames.filter((label: {type: any}, index) => labelNames.indexOf(label) !== index)

    if (labelDuplicates(labelNames).length > 0 && labelDuplicates(labelNames)[0] === value.toLocaleLowerCase().trim()) {
      setLabelNameError(true)
      setErrorIndex(index);
    } else {
      setLabelNameError(false)
    }
  };

  const onBlurTaxonomyHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = event.target;
    if (name === 'label' && value === '') {
      setTaxonomyLabelError(true);
      setErrorIndex(index);
    }

    const labelNames = taxonomies.map(taxonomy => taxonomy.label.toLowerCase().trim())

    let labelDuplicates = (labelNames: any[]) => labelNames.filter((label: {type: any}, index) => labelNames.indexOf(label) !== index)
    if (labelDuplicates(labelNames).length > 0 && labelDuplicates(labelNames)[0] === value.toLocaleLowerCase().trim() ) {
      setLabelNameError(true)
      setErrorIndex(index);
    } else {
      setLabelNameError(false)
    }

    const newTaxonomy = {
      [name]: value.trimEnd(),
      index,
    };

    if (newTaxonomy.hasOwnProperty('label')) {
      dispatch(updateTaxonomyLabel(newTaxonomy));
    }
    if (newTaxonomy.hasOwnProperty('parent')) {
      dispatch(updateTaxonomyParent(newTaxonomy));
    }
  };

  const removeRowHandler = (index: number) => {
    if (taxonomies.length <= 1) return;
    dispatch(deleteTaxonomy({ taxonomieIndex: index }));
  };

  return (
    <>
      {taxonomies?.map((taxonomy: Taxonomy, index: number) => (
        <div className={classes.taxonomies_row_container} key={index}>
          <div className="single_row_form">
            <div className={`single_input input_wrapper`}>
              <label className="form_label" data-required={'required'}>
                Label
              </label>
              <input
                required
                type="text"
                name="label"
                placeholder="Enter a label"
                className="form_input"
                value={taxonomy.label || ''}
                maxLength={24}
                onChange={(event) => onChangeTaxonomyHandler(event, index)}
                onBlur={(event) => onBlurTaxonomyHandler(event, index)}
              />
              {/* Input error for correct index */}

              {taxonomyLabelError && errorIndex === index && (
                <span className="error_message">Label is required</span>
              )}
              {labelNameError && errorIndex === index && (
                <span className="error_message">Label name must be unique</span>
              )}
            </div>
            <div className={`single_input input_wrapper`}>
              <CustomSelectSingle
                id="parent"
                name="parent"
                label="Parent"
                isRequired
                displayValue="label"
                optionsList={[
                  { value: 'music', label: 'Music' },
                  { value: 'rock', label: 'rock' },
                ]}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  onChangeTaxonomyHandler(event, index)
                }
                value={taxonomy.parent}
                className={`${classes.genres_container}`}
                placeholder={'No parent Selected'}
              />
            </div>
            <span className="filler"></span>
            <div className={classes.action_btn_wrapper}>
              {index >= 1 && (
                <button
                  className={`${classes.btn_text} blue_white_link`}
                  onClick={() => removeRowHandler(index)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <Separator />
        </div>
      ))}
    </>
  );
};

export default TaxonomiesRow;
