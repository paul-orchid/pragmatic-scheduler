/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import { Scheduler } from './Scheduler';
import React from 'react';
import { CalEvent } from '../types';
import { divisionDetails, events, resources } from '../data/scheduler';

const TestScheduler = ({
  activeDate,
  onEventChange,
}: {
  activeDate: Date;
  onEventChange?: (event: CalEvent) => void;
}) => {
  return (
    <Scheduler
      activeDate={activeDate}
      resources={resources}
      events={events}
      divisionDetails={divisionDetails}
      onEventChange={onEventChange}
    />
  );
};

describe('Data Display', () => {
  it('shows events and resources', async () => {
    const handleEventChange = jest.fn();
    render(<TestScheduler activeDate={new Date()} onEventChange={handleEventChange} />);

    for (const resource of resources) {
      expect(screen.getByText(resource.name)).toBeInTheDocument();
    }
    for (const event of events) {
      expect(screen.getByText(event.title)).toBeInTheDocument();
    }
  });
  // it('is collapsed when defaultOpen false prop is passed', async () => {
  //   render(
  //     <BrowserRouter>
  //       <TestScheduler SideBarProps={{ defaultOpen: false }} />
  //     </BrowserRouter>,
  //   );

  //   const collapsedSvg: HTMLElement | null = screen.queryByTestId('collapsedSvg');
  //   const expandedSvg: HTMLElement | null = screen.queryByTestId('expandedSvg');

  //   expect(expandedSvg).not.toBeInTheDocument();
  //   expect(collapsedSvg).toBeInTheDocument();
  // });
});

// describe('expand/collapse on hover', () => {
//   it('expands on hover', async () => {
//     const handleSubmitMock = jest.fn();
//     render(
//       <BrowserRouter>
//         <TestScheduler
//           onClick={handleSubmitMock}
//           SideBarProps={{
//             defaultOpen: false,
//             expandOnHover: true,
//           }}
//         />
//       </BrowserRouter>,
//     );

//     const link1: HTMLElement | null = screen.queryByTestId('link1');

//     expect(screen.queryByTestId('link1')).toBeInTheDocument();

//     if (link1) {
//       userEvent.hover(link1);
//     }

//     await waitFor(() => {
//       expect(screen.queryByTestId('collapsedSvg')).not.toBeInTheDocument();
//       expect(screen.queryByTestId('expandedSvg')).toBeInTheDocument();
//     });

//     if (link1) {
//       userEvent.unhover(link1);
//     }

//     await waitFor(() => {
//       expect(screen.queryByTestId('collapsedSvg')).toBeInTheDocument();
//       expect(screen.queryByTestId('expandedSvg')).not.toBeInTheDocument();
//     });
//   });
// });
