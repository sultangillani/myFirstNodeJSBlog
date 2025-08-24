const express = require('express');

function formatTimeAgo(date) {
    const rtf = ('RelativeTimeFormat' in Intl) ? new Intl.RelativeTimeFormat(navigator.language || 'en', { numeric: 'auto' }) : null;

    const d = (date instanceof Date) ? date : new Date(date);
    const diffSec = Math.round((d - new Date()) / 1000); // future negative? -> handled below
    const absSec = Math.abs(diffSec);

    const units = [
      ['year',   60 * 60 * 24 * 365],
      ['month',  60 * 60 * 24 * 30],
      ['week',   60 * 60 * 24 * 7],
      ['day',    60 * 60 * 24],
      ['hour',   60 * 60],
      ['minute', 60],
      ['second', 1],
    ];

    for (const [unit, secInUnit] of units) {
      if (absSec >= secInUnit || unit === 'second') {
        const value = Math.round(diffSec / secInUnit);
        return rtf
          ? rtf.format(value, unit)                     // e.g., "in 2 hours" / "3 days ago"
          : (value <= 0 ? `${Math.abs(value)} ${unit}${Math.abs(value)!==1?'s':''} ago`
                        : `in ${value} ${unit}${value!==1?'s':''}`);
      }
    }
  }

  module.exports = {
    formatTimeAgo
  };