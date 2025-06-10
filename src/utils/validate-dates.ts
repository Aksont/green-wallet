import { BadRequestException } from '@nestjs/common';

export function validateEndDateAfterOrEqualStartDate(
  start: string | Date,
  end: string | Date,
) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new BadRequestException('Invalid date format');
  }

  if (endDate < startDate) {
    throw new BadRequestException(
      'endDate must be after or equal to startDate',
    );
  }
}
