import { useState } from 'react';

// Styles
import classes from './EntriesList.module.scss';

// Libs
import { v4 as uuidv4 } from 'uuid';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

// utils
import paginate from '../../utils/paginate';
import { PAGE_SIZE as pageSize } from '../../utils/constants';
import { useAppDispatch } from '../../utils/useAppDispatch';
import { useAppSelector } from '../../utils/useAppSelector';

// Redux
import { setCurrentProcess } from '../../redux/slices/process';
import { addNewEntry, setCurrentEntryId } from '../../redux/slices/entries';

// Components
import OrangeButton from '../shared/orangeButton';
import ListRow from '../shared/listRow';
import Pagination from '../shared/pagination';
import { CustomSelectSingle } from '../shared/customSelectSingle';

const EntriesList = () => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const entries = useAppSelector((state) => state.entries.entries);
  const templates = useAppSelector((state) => state.templates.templates);

  const [templateSelected, setTemplateSelected] = useState({
    template: '',
  });

  const paginatedData = paginate(entries, currentPage, pageSize);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const selectOptionList = templates.map((template) => {
    return {
      value: template.id,
      label: template.title,
    };
  });

  const onChangeSelectTemplatesHandler = (event: any) => {
    setTemplateSelected({
      template: event.target.value,
    });
  };

  const templateSelectedInputs = templates.find(
    (template) => template.id === templateSelected.template
  )?.inputs;

  const entryTitle = templateSelectedInputs?.find(
    (input) => input.type === 'text'
  )?.label;

  const templateSelectorSubmitHandler = () => {
    dispatch(setCurrentProcess('entriesEditor'));
    // Create new entry
    const id = uuidv4();
    dispatch(
      addNewEntry({
        id,
        // label of first text input
        title: entryTitle || 'Untitled',
        // template id
        template: templateSelected.template,
        updatedAt: Date.now(),
        solanaAddress: '',
        arweaveAddress: '',
        inputs: [],
        taxonomies: [],
      })
    );
    dispatch(setCurrentEntryId(id));
  };

  const entriesEditorEditHandler = (id: string) => {
    dispatch(setCurrentProcess('entriesEditor'));
    dispatch(setCurrentEntryId(id));
  };

  return (
    <>
      <section className={classes.entries_list_section}>
        {/* Modal */}
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            {templates && templates.length > 0 && (
              <div className={classes.actions_buttons}>
                {/* For some reason OrangeButton Component is not working here. To investigate later */}
                <button className={classes.trigger_button}>
                  Create New Entry
                </button>
              </div>
            )}
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="DialogOverlay" />
            <AlertDialog.Content className="DialogContent">
              <AlertDialog.Title className="AlertDialogTitle">
                Choose a template
              </AlertDialog.Title>

              <div className={classes.select_wrapper}>
                <CustomSelectSingle
                  id="template_select"
                  name="template_select"
                  label="Eligible Templates"
                  displayValue="label"
                  optionsList={selectOptionList}
                  onChange={(event: any) =>
                    onChangeSelectTemplatesHandler(event)
                  }
                  value={templateSelected.template}
                  placeholder={'Select one template'}
                  className={classes.select}
                />
              </div>

              <div className="AlertDialogActions">
                <AlertDialog.Action asChild>
                  <div className="submit_btn_container">
                    <OrangeButton
                      btnText={'Submit'}
                      className={classes.submit_btn}
                      type={'button'}
                      callBack={templateSelectorSubmitHandler}
                    />
                  </div>
                </AlertDialog.Action>
                <AlertDialog.Cancel asChild>
                  <button type="button" className="cancel_btn">
                    Cancel
                  </button>
                </AlertDialog.Cancel>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>

        {/* Entries List */}
        <div className={classes.templates_list}>
          {paginatedData.map((entry: any) => {
            const { title, updatedAt, solanaAddress, arweaveAddress } = entry;
            return (
              <ListRow
                key={updatedAt}
                title={title}
                updatedAt={updatedAt}
                solanaAddress={solanaAddress}
                arweaveAddress={arweaveAddress}
                onClickEditHandler={() => entriesEditorEditHandler(entry.id)}
              />
            );
          })}
          {!paginatedData.length && (
            <p className="empty_list">
              No Entries yet
              <br />
              Please create a Template first
            </p>
          )}
        </div>
        <Pagination
          items={entries.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </section>
    </>
  );
};
export default EntriesList;
