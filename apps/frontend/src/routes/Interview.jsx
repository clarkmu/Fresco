import { useState, useEffect } from "react";
import { trpcReact, trpcVanilla } from "@/utils/trpc/trpc";

const Interview = ({ params }) => {
  const {
    protocolId,
    interviewId,
    stageIndex,
  } = params;

  // const [protocol, setProtocol] = useState(null);

  const {
    data: protocol,
    isLoading: protocolIsLoading,
    error: protocolError,
  } = trpcReact.protocols.byHash.useQuery(protocolId);

  useEffect(() => {
    console.log("protocol", protocol);
  }, [protocol])

  // Fetch the protocol and interview data



  return (
    <>
      <h1>Protocol Getter</h1>
    </>
  )
}

export default Interview;

// const initialState = {
//   pendingDirection: 1,
//   pendingStage: -1,
// };

// const childFactoryCreator = (
//   stageBackward,
// ) => (child) => React.cloneElement(child, { stageBackward });

// /**
//   * Check protocol is loaded, and render the stage
//   */
// class Protocol extends Component {
//   constructor(props) {
//     super(props);
//     this.interfaceRef = React.createRef();
//     this.state = {
//       ...initialState,
//     };
//     this.beforeNext = {};
//   }

//   onComplete = (directionOverride) => {
//     const { pendingStage, pendingDirection } = this.state;
//     const { goToNext } = this.props;
//     const nextDirection = directionOverride || pendingDirection;

//     const navigate = (pendingStage === -1)
//       ? () => goToNext(nextDirection)
//       : () => this.goToStage(pendingStage);
//     this.setState(
//       { ...initialState },
//       navigate,
//     );
//   };

//   registerBeforeNext = (beforeNext, stageId) => {
//     if (beforeNext === null) {
//       delete this.beforeNext[stageId];
//       return;
//     }

//     this.beforeNext[stageId] = beforeNext;
//   }

//   goToNext = (direction = 1) => {
//     const { stage, goToNext } = this.props;
//     const beforeNext = get(this.beforeNext, stage.id);

//     if (!beforeNext) {
//       goToNext(direction);
//       return;
//     }

//     this.setState(
//       { pendingStage: -1, pendingDirection: direction },
//       () => beforeNext(direction),
//     );
//   };

//   goToStage = (index) => {
//     const {
//       isSkipped,
//       openDialog,
//       goToStage,
//     } = this.props;
//     if (isSkipped(index)) {
//       openDialog({
//         type: 'Warning',
//         title: 'Show this stage?',
//         confirmLabel: 'Show Stage',
//         onConfirm: () => goToStage(index),
//         message: (
//           <p>
//             Your skip logic settings would normally prevent this stage from being shown in this
//             interview. Do you want to show it anyway?
//           </p>
//         ),
//       });
//     } else {
//       goToStage(index);
//     }
//   }

//   handleClickNext = () => this.goToNext();

//   handleClickBack = () => this.goToNext(-1);

//   handleStageSelect = (index) => {
//     const {
//       stageIndex,
//       stage,
//     } = this.props;

//     if (index === stageIndex) return;

//     const beforeNext = get(this.beforeNext, stage.id);

//     // If no beforeNext is registered, go directly to the stage
//     if (!beforeNext) {
//       this.goToStage(index);
//       return;
//     }

//     // Otherwise construct a pending state, and call beforeNext
//     const direction = (stageIndex > index) ? -1 : 1;
//     this.setState(
//       { pendingStage: index, pendingDirection: direction },
//       () => beforeNext(direction, index),
//     );
//   }

//   render() {
//     const {
//       isSessionLoaded,
//       pathPrefix,
//       percentProgress,
//       promptId,
//       stage,
//       stageBackward,
//       stageIndex,
//     } = this.props;

//     if (!isSessionLoaded) { return null; }

//     const duration = {
//       enter: getCSSVariableAsNumber('--animation-duration-slow-ms') * 2,
//       exit: getCSSVariableAsNumber('--animation-duration-slow-ms') * 2,
//     };

//     return (
//       <div className="protocol">
//         <Fade in={isSessionLoaded} duration={duration}>
//           <Timeline
//             id="TIMELINE"
//             onClickBack={this.handleClickBack}
//             onClickNext={this.handleClickNext}
//             onStageSelect={this.handleStageSelect}
//             percentProgress={percentProgress}
//           />
//         </Fade>
//         <TransitionGroup
//           className="protocol__content"
//           childFactory={childFactoryCreator(stageBackward)}
//         >
//           <StageTransition key={stage.id} stageBackward={stageBackward}>
//             <Stage
//               stage={stage}
//               promptId={promptId}
//               pathPrefix={pathPrefix}
//               stageIndex={stageIndex}
//               registerBeforeNext={this.registerBeforeNext}
//               onComplete={this.onComplete}
//             />
//           </StageTransition>
//         </TransitionGroup>
//       </div>
//     );
//   }
// }

// Protocol.propTypes = {
//   isSessionLoaded: PropTypes.bool.isRequired,
//   pathPrefix: PropTypes.string,
//   percentProgress: PropTypes.number,
//   promptId: PropTypes.number,
//   stage: PropTypes.object.isRequired,
//   stageBackward: PropTypes.bool,
//   stageIndex: PropTypes.number,
//   goToNext: PropTypes.func.isRequired,
// };

// Protocol.defaultProps = {
//   pathPrefix: '',
//   percentProgress: 0,
//   promptId: 0,
//   stageBackward: false,
//   stageIndex: 0,
// };

// function mapStateToProps(state, ownProps) {
//   const sessionId = state.activeSessionId;
//   const stage = getProtocolStages(state)[ownProps.stageIndex] || {};
//   const stageIndex = Math.trunc(ownProps.stageIndex) || 0;
//   const { percentProgress, currentPrompt } = getSessionProgress(state);

//   return {
//     isSkipped: (index) => isStageSkipped(index)(state),
//     isSessionLoaded: !!state.activeSessionId,
//     pathPrefix: `/session/${sessionId}`,
//     percentProgress,
//     promptId: currentPrompt,
//     stage,
//     stageIndex,
//   };
// }

// const mapDispatchToProps = {
//   goToNext: navigateActions.goToNext,
//   goToStage: navigateActions.goToStage,
//   openDialog: dialogActions.openDialog,
// };

// const withStore = connect(mapStateToProps, mapDispatchToProps);

// export default withStore(Protocol);
