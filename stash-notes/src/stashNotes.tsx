interface IPluginApi {
    React: typeof React;
    libraries: {
      Bootstrap: {
        Button: React.FC<any>;
        Modal: React.FC<any> & {
          Header: React.FC<any>;
          Title: React.FC<any>;
          Body: React.FC<any>;
          Footer: React.FC<any>;
        }
      },
      FontAwesomeSolid: {
        faNoteSticky: any;
      }
    },
    components: Record<string, React.FC<any>>;
    patch: {
      before: (target: string, fn: Function) => void;
    }
  }
  
  (function() {
    const api = (window as any).PluginApi as IPluginApi;
    const React = api.React;
    const { Button, Modal } = api.libraries.Bootstrap;
    const { faNoteSticky } = api.libraries.FontAwesomeSolid;
  
    const NotesComponent: React.FC = () => {
      const storageKey = 'Stash Notes';
      const [display, setDisplay] = React.useState(false);
      const [notes, setNotes] = React.useState('');
      const enableModal = () => setDisplay(true);
      const disableModal = () => setDisplay(false);
  
      const saveNotes = (notes: string) => {
        localStorage.setItem(storageKey, notes);
  
        disableModal();
      }
  
      React.useEffect(() => {
        const notesFromStorage = localStorage.getItem(storageKey);
  
        if(notesFromStorage) {
          setNotes(notesFromStorage);
        }
      }, []);
  
      return (
        <>
          <NavButton onClickHandler={enableModal} />
          <NotesModal 
            displayState={display} 
            onCloseHandler={disableModal}
            onSaveHandler={saveNotes}
            notesState={notes}
            notesChangeHandler={(n: string) => setNotes(n)}
          />
        </>
      )
    }
  
    const NavButton: React.FC<{
      onClickHandler: Function
    }> = ({onClickHandler}) => {
      const { Icon } = api.components;
  
      return (
        <>
          <Button
            className="minimal d-flex align-items-center h-100"
            title="Notes"
            onClick={onClickHandler}
          >
            <Icon icon={faNoteSticky} />
          </Button>
        </>
      );
    }
  
    const NotesModal: React.FC<{
      displayState: boolean;
      onCloseHandler: Function;
      onSaveHandler: Function;
      notesState?: string;
      notesChangeHandler: Function;
    }> = ({
      displayState,
      onCloseHandler,
      onSaveHandler,
      notesState,
      notesChangeHandler
    }) => {
      return(
        <Modal show={displayState} onHide={onCloseHandler}>
          <Modal.Header closeButton>
            <Modal.Title>Notes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea 
              className="text-input form-control"
              rows={10}
              value={notesState}
              onChange={(e) => notesChangeHandler(e.target.value)}
            ></textarea>
            <hr />
            <h5>Important!</h5>
            Notes are stored as plain text in your browser's local storage. Do not save sensitive information. Notes will be lost after closing a browser in incognito mode.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onCloseHandler}>
              Close
            </Button>
            <Button variant="primary" onClick={() => onSaveHandler(notesState)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
  
    api.patch.before("MainNavBar.UtilityItems", function (props: any) {
      return [
        {
          children: (
            <>
              {props.children}
              <NotesComponent />
            </>
          )
        }
      ]
    });
    
  })();