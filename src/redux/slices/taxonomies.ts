import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Taxonomies, Taxonomy, TaxonomyErrors} from '../../types/Taxonomies';

interface TaxonomiesState {
  original: Taxonomy[], 
  new: Taxonomy[], 
  edited: Taxonomy[], 
  errors: any,
  isPublishable: boolean;
}

const initialState: TaxonomiesState = {
  original: [], 
  new: [], 
  edited: [], 
  errors: [],
  isPublishable: false,
};

const slice = createSlice({
  name: 'taxonomies',
  initialState,
  reducers: {
    setTaxonomies: (state, { payload }: PayloadAction<any>) => {
      state.original = payload;
    },
    addNewTaxonomy: (state, action: PayloadAction<any>) => {
      state.new.push(action.payload);
    },
    deleteTaxonomy: (state, { payload }: PayloadAction<any>) => {
      const { taxonomieIndex } = payload;
      state.original.splice(taxonomieIndex, 1);
    },
    updateTaxonomyLabel: (state, { payload }: PayloadAction<any>) => {
      const { label, index, publicKey } = payload;
      let originalTaxonomy = state.original[index]
      if( originalTaxonomy !== null && originalTaxonomy !== undefined ) {
        if(state.edited.length == 0) {
          state.edited.push(originalTaxonomy)
          state.edited[state.edited.length - 1].label = label
        } else {
          state.edited.forEach((editedTaxo, index) => {
            if(editedTaxo.publicKey === originalTaxonomy.publicKey) {
              state.edited[index].label = label
            } else {
              state.edited.push(originalTaxonomy)
              state.edited[state.edited.length - 1].label = label
            }
          })
        }
      } else {
        state.new.forEach((newTaxo) => {
          if(newTaxo.publicKey === publicKey) {
            newTaxo.label = label
          } 
        })
      }
    },
    updateTaxonomyParent: (state, { payload }: PayloadAction<any>) => {
      const { parent, index } = payload;
      state.original[index].parent = parent;
    },
    updateTaxonomyGrandParent: (state, { payload }: PayloadAction<any>) => {
      const { grandParent, index } = payload;
      state.original[index].grandParent = grandParent;
    },
    setTaxonomiesIsPublishable: (state, { payload }: PayloadAction<any>) => {
      state.isPublishable = payload;
    },
    setTaxonomyErrors: (state, {payload}: PayloadAction<any>) => {
      const { publicKey, duplicateRecord, index, message } = payload
      state.errors.push(
        {
          publicKey,
          duplicateRecord,
          index, 
          message
        }
      ) 
    },
    removeTaxonomyErrors: (state, {payload}: PayloadAction<any>) => {
      const { publicKey } = payload
      let record = state.errors.filter((error: { publicKey: any; }) => error.publicKey == publicKey)
      let duplicatePairRecord = state.errors.filter((error: { duplicateRecord: any; }) => error.duplicateRecord == publicKey)
      state.errors.splice(state.errors.indexOf(record), 1);
      state.errors.splice(state.errors.indexOf(duplicatePairRecord), 1);
    },
  },
});

export const {
  setTaxonomies,
  addNewTaxonomy,
  deleteTaxonomy,
  updateTaxonomyLabel,
  updateTaxonomyParent,
  updateTaxonomyGrandParent,
  setTaxonomiesIsPublishable,
  setTaxonomyErrors, 
  removeTaxonomyErrors
} = slice.actions;

// Reducer
export default slice.reducer;
