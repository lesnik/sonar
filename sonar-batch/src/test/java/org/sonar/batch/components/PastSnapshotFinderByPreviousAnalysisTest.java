/*
 * Sonar, open source software quality management tool.
 * Copyright (C) 2008-2012 SonarSource
 * mailto:contact AT sonarsource DOT com
 *
 * Sonar is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * Sonar is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with Sonar; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
package org.sonar.batch.components;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.core.IsNull.nullValue;
import static org.junit.Assert.assertThat;

import org.junit.Test;
import org.sonar.api.database.model.Snapshot;
import org.sonar.jpa.test.AbstractDbUnitTestCase;

import java.text.ParseException;

public class PastSnapshotFinderByPreviousAnalysisTest extends AbstractDbUnitTestCase {

  @Test
  public void shouldFindPreviousAnalysis() throws ParseException {
    setupData("shouldFindPreviousAnalysis");

    Snapshot projectSnapshot = getSession().getSingleResult(Snapshot.class, "id", 1010);
    PastSnapshotFinderByPreviousAnalysis finder = new PastSnapshotFinderByPreviousAnalysis(getSession());

    PastSnapshot pastSnapshot = finder.findByPreviousAnalysis(projectSnapshot);
    assertThat(pastSnapshot.getProjectSnapshotId(), is(1009));
  }

  @Test
  public void shouldReturnPastSnapshotEvenWhenNoPreviousAnalysis() throws ParseException {
    setupData("shouldNotFindPreviousAnalysis");

    Snapshot projectSnapshot = getSession().getSingleResult(Snapshot.class, "id", 1010);
    PastSnapshotFinderByPreviousAnalysis finder = new PastSnapshotFinderByPreviousAnalysis(getSession());

    PastSnapshot pastSnapshot = finder.findByPreviousAnalysis(projectSnapshot);
    assertThat(pastSnapshot.isRelatedToSnapshot(), is(false));
    assertThat(pastSnapshot.getProjectSnapshot(), nullValue());
    assertThat(pastSnapshot.getTargetDate(), nullValue());
  }
}
